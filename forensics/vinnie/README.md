# blackmail 
### Description

I managed to clone Santa's USB key which contains all his darkest secrets. I could use it to blackmail him to finally get out of the naughty list, but it is encrypted with something called BitLocker, can you help me open it? I have the recovery key file, but it is corrupted and unreadable, maybe you will be able to do something with it?

File available here: https://www.dropbox.com/scl/fi/5kj64c70ruaoxdcfrk4ah/h0h0h0day-2022-blackmail.img?rlkey=nqwu0fde4o9lek69isgn4l3tl&dl=0

### Writeup

The bitlocker recovery key has a checksum to avoid typos and reading errors, every 2 blocks (or 12 numbers) must be divisible by 11. With this information, we can reduce the number of possible keys from `100 000 000` to `5248`. Using the much smaller keyspace, trying until a key works with `dislocker` should take around 15-30 mins and while using `bitcracker`, around 1-2 mins. When the correct key is found, use it to open the image using your favorite OS and read the flag embedded in the video.
