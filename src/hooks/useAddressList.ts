import { useState, useCallback } from 'react';
import { getAddresses } from '../services/addressService';

interface Address {
    code: string;
    name: string;
}

interface AddressResponse {
    data: {
        addresses: Address[];
    };
}

const useAddressList = () => {
    const [sidoList, setSidoList] = useState<Address[]>([]);
    const [sigunguList, setSigunguList] = useState<Address[]>([]);
    const [dongList, setDongList] = useState<Address[]>([]);

    const loadSidoList = useCallback(async () => {
        try {
            const response = await getAddresses() as AddressResponse;
            if (response?.data?.addresses) {
                setSidoList(response.data.addresses);
            }
        } catch (error) {
            console.error('시/도 목록 로드 실패:', error);
        }
    }, []);

    const loadSigunguList = useCallback(async (sidoCode: string) => {
        try {
            const response = await getAddresses(sidoCode) as AddressResponse;
            if (response?.data?.addresses) {
                setSigunguList(response.data.addresses);
            }
        } catch (error) {
            console.error('시/구/군 목록 로드 실패:', error);
        }
    }, []);

    const loadDongList = useCallback(async (sigunguCode: string) => {
        try {
            const response = await getAddresses(sigunguCode) as AddressResponse;
            if (response?.data?.addresses) {
                setDongList(response.data.addresses);
            }
        } catch (error) {
            console.error('동/읍/면 목록 로드 실패:', error);
        }
    }, []);

    const resetSigunguList = useCallback(() => {
        setSigunguList([]);
    }, []);

    const resetDongList = useCallback(() => {
        setDongList([]);
    }, []);

    return {
        sidoList,
        sigunguList,
        dongList,
        loadSidoList,
        loadSigunguList,
        loadDongList,
        resetSigunguList,
        resetDongList,
    };
};

export default useAddressList;

