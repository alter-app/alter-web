import { useState, useCallback } from 'react';
import { getAddresses } from '../services/addressService';

const useAddressList = () => {
    const [sidoList, setSidoList] = useState([]);
    const [sigunguList, setSigunguList] = useState([]);
    const [dongList, setDongList] = useState([]);

    const loadSidoList = useCallback(async () => {
        try {
            const response = await getAddresses();
            if (response?.data?.addresses) {
                setSidoList(response.data.addresses);
            }
        } catch (error) {
            console.error('시/도 목록 로드 실패:', error);
        }
    }, []);

    const loadSigunguList = useCallback(async (sidoCode) => {
        try {
            const response = await getAddresses(sidoCode);
            if (response?.data?.addresses) {
                setSigunguList(response.data.addresses);
            }
        } catch (error) {
            console.error('시/구/군 목록 로드 실패:', error);
        }
    }, []);

    const loadDongList = useCallback(async (sigunguCode) => {
        try {
            const response = await getAddresses(sigunguCode);
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

