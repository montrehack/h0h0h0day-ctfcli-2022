from scapy import *
from scapy.contrib.automotive.doip import DoIPSocket, UDS_DoIPSocket
from scapy.contrib.automotive.uds import UDS, UDS_ER
from scapy.contrib.automotive.uds_scan import UDS_ServiceEnumerator, UDS_DSCEnumerator, UDS_Scanner, UDS_RDBIEnumerator


def reconnect():
    return UDS_DoIPSocket(ip='127.0.0.1', port=13400)


#es = [UDS_ServiceEnumerator]
es = [UDS_RDBIEnumerator]


def reset():
    reconnect().sr1(UDS()/UDS_ER(resetType="hardReset"),
                    verbose=False, timeout=1)


s = UDS_Scanner(reconnect(), reconnect_handler=reconnect,
                reset_handler=reset, test_cases=es,
                UDS_RDBIEnumerator_kwargs={
                    "scan_range": range(0x1300, 0x1338, 1)})

try:
    s.scan()
except KeyboardInterrupt:
    pass

s.show_testcases_status()
s.show_testcases()