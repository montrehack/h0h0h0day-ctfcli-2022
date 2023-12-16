import styles from './List.module.css';
import { useQuery } from '@tanstack/react-query'
import { useAuth } from "react-oidc-context";

export function List(props) {
    const auth = useAuth();
    const { isLoading, isError, data, error } = useQuery({
        queryKey: ['flag'],
        queryFn: async () => {
            const response = await fetch(`http://${process.env.REACT_APP_HOSTNAME}:${process.env.REACT_APP_API_PORT}/Flag`,
                {
                    headers: {
                        Authorization: `Bearer ${auth.user?.access_token}`
                    }
                })
            if (!response.ok) {
                if (response.status === 403) {
                    throw new Error('You are not santa, so you are forbidden to view this page')
                }

                throw new Error('Network response was not ok')
            }
            return await response.text()
        },
        retry: 1
    });

    if (isLoading) {
        return <span>Loading...</span>
    }

    if (isError) {
        return <span>Error: {error.message}</span>
    }

    return (
        <div className={styles.List}>
            <ul>
                <li>Montrehack person: A well deserved flag ({data}) </li>
                <li>The dev who coded this portal: A private openid client</li>
            </ul>
        </div>
    )
}