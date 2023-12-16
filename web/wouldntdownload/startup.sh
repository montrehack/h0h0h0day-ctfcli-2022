#! /bin/sh

npm start &
ret=$pid
sleep 5 
echo '{"users": [{"name": "admin","data": "'$FLAG'"}]}' > data.json
curl -v localhost:80/data "$TESTING_OPTIONS"
echo '{"users": [{"name": "fred","data": "Have a nice day!"}]}' > data.json
wait $ret
