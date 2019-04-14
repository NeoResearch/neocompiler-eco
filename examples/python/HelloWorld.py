from boa.interop.Neo.Runtime import Notify, CheckWitness

def Main():
    #OWNER=b'031a6c6fbbdf02ca351745fa86b9ba5a9452d785ac4f7fc2b7548ca2a46c4fcf4a'
    OWNER=b'\x03\x1alo\xbb\xdf\x02\xca5\x17E\xfa\x86\xb9\xbaZ\x94R\xd7\x85\xacO\x7f\xc2\xb7T\x8c\xa2\xa4lO\xcfJ'
    result = CheckWitness(OWNER)
    if result:
        print("OWNER is caller")
        return True
    return False
