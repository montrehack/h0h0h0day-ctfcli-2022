const { Provider } = require('oidc-provider');
const express = require('express');
const { generateKeyPairSync, generateKeySync } = require('crypto');
const path = require('path');
const { strict: assert } = require('assert');

const corsProp = 'urn:custom:client:allowed-cors-origins';
const pkceRequiredProp = 'urn:custom:client:pkce-required';

const {
    PORT = 44000,
    HOSTNAME = "localhost",
    FRONT_END_PORT = 44030,
    API_PORT = 44060,
    ISSUER = `http://${HOSTNAME}:${PORT}` } = process.env;

const body = express.urlencoded({ extended: false });

async function defaultResource(ctx, client) {
    return ctx.oidc.issuer;
}

async function getResourceServerInfo(ctx, identifier, client) {
    return {
        scope: 'h0h0h0',
        audience: ctx.oidc.issuer,
        accessTokenTTL: 60 * 60,
        accessTokenFormat: 'jwt',
        jwt: {
            sign: { alg: 'RS256' },
        },
    }
}

async function loadExistingGrant(ctx) {
    try {
    const grantId = ctx.oidc.result?.consent?.grantId
        || ctx.oidc.session.grantIdFor(ctx.oidc.client.clientId);

    if (grantId) {

        // keep grant expiry aligned with session expiry
        // to prevent consent prompt being requested when grant expires
        const grant = await ctx.oidc.provider.Grant.find(grantId);

        // this aligns the Grant ttl with that of the current session
        // if the same Grant is used for multiple sessions, or is set
        // to never expire, you probably do not want this in your code
        if (ctx.oidc.account && grant.exp < ctx.oidc.session.exp) {
            grant.exp = ctx.oidc.session.exp;

            await grant.save();
        }

        return grant;
    } else {
        const grant = new ctx.oidc.provider.Grant({
            clientId: ctx.oidc.client.clientId,
            accountId: ctx.oidc.session.accountId,
        });

        grant.addOIDCScope('openid');
        grant.addResourceScope(ctx.oidc.issuer, 'h0h0h0');
        await grant.save();
        return grant;
    }
    } catch(e) {
        return undefined;
    }
}

function pkceRequired(ctx, client) {
    return client[pkceRequiredProp] === true;
}

function clientBasedCORS(ctx, origin, client) {
    return client[corsProp].includes(origin);
}

function generateJwk() {
    const { privateKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
    return privateKey.export({ format: 'jwk' });
}

function generateSecret() {
    const key = generateKeySync('hmac', { length: 64 });
    return key.export().toString('hex');
}

async function findAccount(ctx, id) {
    return {
        accountId: id,
        async claims(use, scope) { return { sub: id } }
    }
}

const configuration = {
    clients: [
        {
            client_id: 'guest',
            client_secret: 'lolsifdjwdiorgnvweqihwugq',
            grant_types: [
                'authorization_code'
            ],
            redirect_uris: [`http://${HOSTNAME}:${FRONT_END_PORT}/callback`],
            token_endpoint_auth_method: 'none',
            [corsProp]: [`http://${HOSTNAME}:${FRONT_END_PORT}`],
            [pkceRequiredProp]: true
        },
        {
            client_id: 'santa',
            client_secret: 'doesntmatteritsapublicclientanyway',
            grant_types: [
                'authorization_code'
            ],
            redirect_uris: [
                `http://${HOSTNAME}:${API_PORT}/swagger/oauth2-redirect.html`,
                `http://${HOSTNAME}:${FRONT_END_PORT}/callback`,
                `http://localhost:44030/local/callback`
            ],
            token_endpoint_auth_method: 'none',
            [corsProp]: [
                `http://${HOSTNAME}:${API_PORT}`,
                `http://${HOSTNAME}:${FRONT_END_PORT}`
            ],
            [pkceRequiredProp]: true
        }
    ],
    pkce: {
        methods: ['S256'],
        required: pkceRequired
    },
    features: {
        resourceIndicators: {
            defaultResource,
            enabled: true,
            getResourceServerInfo
        },
        devInteractions: {
            enabled: false
        }
    },
    clientBasedCORS,
    loadExistingGrant,
    extraClientMetadata: {
        properties: [corsProp]
    },
    jwks: {
        keys: [
            generateJwk()
        ]
    },
    cookies: {
        keys: [generateSecret()]
    },
    findAccount
}

const oidc = new Provider(ISSUER, configuration);

const app = express()
app.set('view engine', 'ejs');

function setNoCache(req, res, next) {
    res.set('Pragma', 'no-cache');
    res.set('Cache-Control', 'no-cache, no-store');
    next();
}

app.get('/interaction/login.css', function (req, res) {
    res.sendFile(path.join(__dirname, '/views/login.css'));
});

app.get('/interaction/:uid', setNoCache, async (req, res, next) => {
    try {
        const {
            uid, prompt, params
        } = await oidc.interactionDetails(req, res);

        const client = await oidc.Client.find(params.client_id);

        switch (prompt.name) {
            case 'login': {
                return res.render('login', {
                    uid,
                    title: 'Sign-in',
                    msg: ''
                });
            }
            case 'consent': {
                return res.render('interaction', {
                    client,
                    uid,
                    details: prompt.details,
                    params,
                    title: 'Authorize',
                });
            }
            default:
                return undefined;
        }
    } catch (err) {
        return next(err);
    }
});

app.post('/interaction/:uid/login', setNoCache, body, async (req, res, next) => {
    try {
        const { uid, prompt: { name } } = await oidc.interactionDetails(req, res);
        assert.equal(name, 'login');
        if (req.body.body !== 'guest' && req.body.password !== 'guest') {
            return res.render('login', {
                uid,
                title: 'Sign-in',
                msg: "Invalid username or password"
            });
        }

        const result = {
            login: {
                accountId: req.body.login,
            },
        };

        await oidc.interactionFinished(req, res, result, { mergeWithLastSubmission: false });
    } catch (err) {
        next(err);
    }
});

app.post('/interaction/:uid/confirm', setNoCache, body, async (req, res, next) => {
    try {
        const interactionDetails = await oidc.interactionDetails(req, res);
        const { prompt: { name, details }, params, session: { accountId } } = interactionDetails;
        assert.equal(name, 'consent');

        let { grantId } = interactionDetails;
        let grant;

        if (grantId) {
            // we'll be modifying existing grant in existing session
            grant = await oidc.Grant.find(grantId);
        } else {
            // we're establishing a new grant
            grant = new oidc.Grant({
                accountId,
                clientId: params.client_id,
            });
        }

        if (details.missingOIDCScope) {
            grant.addOIDCScope(details.missingOIDCScope.join(' '));
        }
        if (details.missingOIDCClaims) {
            grant.addOIDCClaims(details.missingOIDCClaims);
        }
        if (details.missingResourceScopes) {
            // eslint-disable-next-line no-restricted-syntax
            for (const [indicator, scopes] of Object.entries(details.missingResourceScopes)) {
                grant.addResourceScope(indicator, scopes.join(' '));
            }
        }

        grantId = await grant.save();

        const consent = {};
        if (!interactionDetails.grantId) {
            // we don't have to pass grantId to consent, we're just modifying existing one
            consent.grantId = grantId;
        }

        const result = { consent };
        await oidc.interactionFinished(req, res, result, { mergeWithLastSubmission: true });
    } catch (err) {
        next(err);
    }
});

app.get('/interaction/:uid/abort', setNoCache, async (req, res, next) => {
    try {
        const result = {
            error: 'access_denied',
            error_description: 'End-User aborted interaction',
        };
        await oidc.interactionFinished(req, res, result, { mergeWithLastSubmission: false });
    } catch (err) {
        next(err);
    }
});

app.use('/', oidc.callback());
app.listen(PORT);
