import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import useAddressList from '../../hooks/useAddressList';
import searchSvg from '../../assets/icons/searchSvg.svg';
import closeIcon from '../../assets/icons/closeIcon.svg';

interface Address {
    code: string;
    name: string;
}

interface Region {
    code: string;
    name: string;
    fullName: string;
    province: string;
    district: string;
    town: string;
    provinceCode: string;
    districtCode: string;
    townCode: string;
    level?: string;
}

interface RegionFilterProps {
    isOpen: boolean;
    onClose: () => void;
    selectedRegions?: Region[];
    onRegionsChange: (regions: Region[]) => void;
    maxRegions?: number;
}

const RegionFilter = ({
    isOpen,
    onClose,
    selectedRegions = [],
    onRegionsChange,
    maxRegions = 10,
}: RegionFilterProps) => {
    const [searchInput, setSearchInput] = useState('');
    const [searchResults, setSearchResults] = useState<Region[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [activeTab, setActiveTab] = useState('시/도');
    const [selectedSido, setSelectedSido] = useState<Address | null>(null);
    const [selectedSigungu, setSelectedSigungu] =
        useState<Address | null>(null);
    const [regions, setRegions] = useState<Region[]>(selectedRegions);
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const {
        sidoList,
        sigunguList,
        dongList,
        loadSidoList,
        loadSigunguList,
        loadDongList,
        resetSigunguList,
        resetDongList,
    } = useAddressList();

    // 시/도 목록 로드
    useEffect(() => {
        if (isOpen) {
            loadSidoList();
        }
    }, [isOpen, loadSidoList]);

    const handleSidoSelect = (sido: Address) => {
        setSelectedSido(sido);
        setSelectedSigungu(null);
        resetDongList();
        setActiveTab('시/구/군');
        loadSigunguList(sido.code);
    };

    const handleSidoAllSelect = () => {
        // 시/도 전체 선택
        if (regions.length >= maxRegions) {
            alert(
                `최대 ${maxRegions}개까지 선택할 수 있어요.`
            );
            return;
        }

        // 시/도 전체는 province만 설정, district와 town은 빈 문자열
        const region = {
            code: 'ALL_SIDO',
            name: '전체',
            fullName: '전체',
            province: '',
            district: '',
            town: '',
            provinceCode: '',
            districtCode: '',
            townCode: '',
        };

        // 중복 체크 (전체는 하나만)
        if (!regions.some((r) => r.code === 'ALL_SIDO')) {
            setRegions([...regions, region]);
        }
    };

    const handleSigunguSelect = (sigungu: Address) => {
        setSelectedSigungu(sigungu);
        resetDongList();
        setActiveTab('동/읍/면');
        loadDongList(sigungu.code);
    };

    const handleSigunguAllSelect = () => {
        // 시/구/군 전체 선택
        if (regions.length >= maxRegions) {
            alert(
                `최대 ${maxRegions}개까지 선택할 수 있어요.`
            );
            return;
        }

        if (!selectedSido) return;

        // 시/구/군 전체는 province와 district 설정, town은 빈 문자열
        const region = {
            code: `ALL_SIGUNGU_${selectedSido.code}`,
            name: `${selectedSido.name} 전체`,
            fullName: `${selectedSido.name} 전체`,
            province: selectedSido.name,
            district: '',
            town: '',
            provinceCode: selectedSido.code,
            districtCode: '',
            townCode: '',
        };

        // 중복 체크
        if (
            !regions.some(
                (r) =>
                    r.code ===
                    `ALL_SIGUNGU_${selectedSido.code}`
            )
        ) {
            setRegions([...regions, region]);
        }
    };

    const handleDongSelect = (dong: Address) => {
        if (regions.length >= maxRegions) {
            alert(
                `최대 ${maxRegions}개까지 선택할 수 있어요.`
            );
            return;
        }

        const region = {
            code: dong.code,
            name: dong.name,
            fullName: `${selectedSido.name} ${selectedSigungu.name} ${dong.name}`,
            province: selectedSido.name,
            district: selectedSigungu.name,
            town: dong.name,
            provinceCode: selectedSido.code,
            districtCode: selectedSigungu.code,
            townCode: dong.code,
        };

        // 중복 체크
        if (!regions.some((r) => r.code === region.code)) {
            setRegions([...regions, region]);
        }
    };

    const handleDongAllSelect = () => {
        // 동/읍/면 전체 선택
        if (regions.length >= maxRegions) {
            alert(
                `최대 ${maxRegions}개까지 선택할 수 있어요.`
            );
            return;
        }

        if (!selectedSido || !selectedSigungu) return;

        // 동/읍/면 전체는 province, district 설정, town은 빈 문자열
        const region = {
            code: `ALL_DONG_${selectedSigungu.code}`,
            name: `${selectedSido.name} ${selectedSigungu.name} 전체`,
            fullName: `${selectedSido.name} ${selectedSigungu.name} 전체`,
            province: selectedSido.name,
            district: selectedSigungu.name,
            town: '',
            provinceCode: selectedSido.code,
            districtCode: selectedSigungu.code,
            townCode: '',
        };

        // 중복 체크
        if (
            !regions.some(
                (r) =>
                    r.code ===
                    `ALL_DONG_${selectedSigungu.code}`
            )
        ) {
            setRegions([...regions, region]);
        }
    };

    const handleRemoveRegion = (code: string) => {
        setRegions(regions.filter((r) => r.code !== code));
    };

    const handleSearch = async (keyword: string) => {
        if (!keyword.trim()) {
            setSearchResults([]);
            setIsSearching(false);
            return;
        }

        setIsSearching(true);
        try {
            // 검색은 전체 주소를 순회하면서 매칭하는 방식으로 구현
            // 실제로는 백엔드에서 검색 API를 제공하는 것이 좋음
            const allResults: Region[] = [];

            // 시/도 검색
            const sidoResults = sidoList.filter((item) =>
                item.name.includes(keyword)
            );
            sidoResults.forEach((item) => {
                allResults.push({
                    code: item.code,
                    name: item.name,
                    fullName: item.name,
                    level: '시/도',
                });
            });

            // 시/구/군 검색 (선택된 시/도가 있으면 그 안에서만)
            if (selectedSido) {
                const sigunguResults = sigunguList.filter(
                    (item) => item.name.includes(keyword)
                );
                sigunguResults.forEach((item) => {
                    allResults.push({
                        code: item.code,
                        name: item.name,
                        fullName: `${selectedSido.name} ${item.name}`,
                        level: '시/구/군',
                    });
                });
            }

            // 동/읍/면 검색 (선택된 시/구/군이 있으면 그 안에서만)
            if (selectedSigungu) {
                const dongResults = dongList.filter(
                    (item) => item.name.includes(keyword)
                );
                dongResults.forEach((item) => {
                    allResults.push({
                        code: item.code,
                        name: item.name,
                        fullName: `${selectedSido.name} ${selectedSigungu.name} ${item.name}`,
                        level: '동/읍/면',
                    });
                });
            }

            setSearchResults(allResults);
        } catch (error) {
            console.error('검색 실패:', error);
        } finally {
            setIsSearching(false);
        }
    };

    const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchInput(value);

        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        searchTimeoutRef.current = setTimeout(() => {
            handleSearch(value);
        }, 300);
    };

    const handleSearchResultClick = (result: Region) => {
        if (result.level === '시/도') {
            const sido = sidoList.find(
                (s) => s.code === result.code
            );
            if (sido) {
                handleSidoSelect(sido);
            }
        } else if (result.level === '시/구/군') {
            const sigungu = sigunguList.find(
                (s) => s.code === result.code
            );
            if (sigungu) {
                handleSigunguSelect(sigungu);
            }
        } else if (result.level === '동/읍/면') {
            const dong = dongList.find(
                (d) => d.code === result.code
            );
            if (dong) {
                handleDongSelect(dong);
            }
        }
        setSearchInput('');
        setSearchResults([]);
    };

    const handleReset = () => {
        setRegions([]);
        setSelectedSido(null);
        setSelectedSigungu(null);
        resetDongList();
        resetSigunguList();
        setActiveTab('시/도');
        setSearchInput('');
        setSearchResults([]);
    };

    const handleApply = () => {
        // 적용 버튼 클릭 시에만 부모에게 알림
        if (onRegionsChange) {
            onRegionsChange(regions);
        }
        if (onClose) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <Overlay>
            <Modal>
                <Header>
                    <Title>지역설정</Title>
                    <CloseButton onClick={onClose}>
                        <img src={closeIcon} alt='닫기' />
                    </CloseButton>
                </Header>

                <Instruction>
                    지역을 선택해 주세요.
                </Instruction>

                <SearchContainer>
                    <SearchInputWrapper>
                        <SearchInput
                            type='text'
                            value={searchInput}
                            onChange={
                                handleSearchInputChange
                            }
                        />
                        <SearchIcon>
                            <img
                                src={searchSvg}
                                alt='검색'
                            />
                        </SearchIcon>
                    </SearchInputWrapper>
                </SearchContainer>

                {searchInput &&
                    searchResults.length > 0 && (
                        <SearchResults>
                            {searchResults.map((result) => (
                                <SearchResultItem
                                    key={result.code}
                                    onClick={() =>
                                        handleSearchResultClick(
                                            result
                                        )
                                    }
                                >
                                    {result.fullName}
                                </SearchResultItem>
                            ))}
                        </SearchResults>
                    )}

                <Tabs>
                    <Tab
                        $active={activeTab === '시/도'}
                        onClick={() =>
                            setActiveTab('시/도')
                        }
                    >
                        시/도
                    </Tab>
                    <Tab
                        $active={activeTab === '시/구/군'}
                        onClick={() =>
                            setActiveTab('시/구/군')
                        }
                    >
                        시/구/군
                    </Tab>
                    <Tab
                        $active={activeTab === '동/읍/면'}
                        onClick={() =>
                            setActiveTab('동/읍/면')
                        }
                    >
                        동/읍/면
                    </Tab>
                </Tabs>

                <RegionColumns>
                    {activeTab === '시/도' && (
                        <RegionColumn>
                            <RegionItem
                                $selected={regions.some(
                                    (r) =>
                                        r.code ===
                                        'ALL_SIDO'
                                )}
                                onClick={
                                    handleSidoAllSelect
                                }
                            >
                                전체
                                {regions.some(
                                    (r) =>
                                        r.code ===
                                        'ALL_SIDO'
                                ) && (
                                    <CheckIcon>
                                        <svg
                                            width='16'
                                            height='16'
                                            viewBox='0 0 24 24'
                                            fill='none'
                                        >
                                            <path
                                                d='M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z'
                                                fill='#399982'
                                            />
                                        </svg>
                                    </CheckIcon>
                                )}
                            </RegionItem>
                            {sidoList.map((sido: Address) => (
                                <RegionItem
                                    key={sido.code}
                                    $selected={
                                        selectedSido?.code ===
                                        sido.code
                                    }
                                    onClick={() =>
                                        handleSidoSelect(
                                            sido
                                        )
                                    }
                                >
                                    {sido.name}
                                </RegionItem>
                            ))}
                        </RegionColumn>
                    )}

                    {activeTab === '시/구/군' &&
                        selectedSido && (
                            <RegionColumn>
                                <RegionItem
                                    $selected={regions.some(
                                        (r) =>
                                            r.code ===
                                            `ALL_SIGUNGU_${selectedSido.code}`
                                    )}
                                    onClick={
                                        handleSigunguAllSelect
                                    }
                                >
                                    {selectedSido.name} 전체
                                    {regions.some(
                                        (r) =>
                                            r.code ===
                                            `ALL_SIGUNGU_${selectedSido.code}`
                                    ) && (
                                        <CheckIcon>
                                            <svg
                                                width='16'
                                                height='16'
                                                viewBox='0 0 24 24'
                                                fill='none'
                                            >
                                                <path
                                                    d='M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z'
                                                    fill='#399982'
                                                />
                                            </svg>
                                        </CheckIcon>
                                    )}
                                </RegionItem>
                                {sigunguList.map(
                                    (sigungu: Address) => (
                                        <RegionItem
                                            key={
                                                sigungu.code
                                            }
                                            $selected={
                                                selectedSigungu?.code ===
                                                sigungu.code
                                            }
                                            onClick={() =>
                                                handleSigunguSelect(
                                                    sigungu
                                                )
                                            }
                                        >
                                            {sigungu.name}
                                        </RegionItem>
                                    )
                                )}
                            </RegionColumn>
                        )}

                    {activeTab === '동/읍/면' &&
                        selectedSigungu && (
                            <RegionColumn>
                                <RegionItem
                                    $selected={regions.some(
                                        (r) =>
                                            r.code ===
                                            `ALL_DONG_${selectedSigungu.code}`
                                    )}
                                    onClick={
                                        handleDongAllSelect
                                    }
                                >
                                    {selectedSido.name}{' '}
                                    {selectedSigungu.name}{' '}
                                    전체
                                    {regions.some(
                                        (r) =>
                                            r.code ===
                                            `ALL_DONG_${selectedSigungu.code}`
                                    ) && (
                                        <CheckIcon>
                                            <svg
                                                width='16'
                                                height='16'
                                                viewBox='0 0 24 24'
                                                fill='none'
                                            >
                                                <path
                                                    d='M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z'
                                                    fill='#399982'
                                                />
                                            </svg>
                                        </CheckIcon>
                                    )}
                                </RegionItem>
                                {dongList.map((dong: Address) => (
                                    <RegionItem
                                        key={dong.code}
                                        $selected={regions.some(
                                            (r) =>
                                                r.code ===
                                                dong.code
                                        )}
                                        onClick={() =>
                                            handleDongSelect(
                                                dong
                                            )
                                        }
                                    >
                                        {dong.name}
                                        {regions.some(
                                            (r) =>
                                                r.code ===
                                                dong.code
                                        ) && (
                                            <CheckIcon>
                                                <svg
                                                    width='16'
                                                    height='16'
                                                    viewBox='0 0 24 24'
                                                    fill='none'
                                                >
                                                    <path
                                                        d='M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z'
                                                        fill='#399982'
                                                    />
                                                </svg>
                                            </CheckIcon>
                                        )}
                                    </RegionItem>
                                ))}
                            </RegionColumn>
                        )}
                </RegionColumns>

                <SelectedRegionsSection>
                    <SelectedRegionsInfo>
                        최대 {maxRegions}개까지 선택할 수
                        있어요.
                    </SelectedRegionsInfo>
                    <SelectedRegionsList>
                        {regions.map((region) => (
                            <SelectedRegionTag
                                key={region.code}
                            >
                                {region.name}
                                <RemoveButton
                                    onClick={() =>
                                        handleRemoveRegion(
                                            region.code
                                        )
                                    }
                                >
                                    <img
                                        src={closeIcon}
                                        alt='제거'
                                    />
                                </RemoveButton>
                            </SelectedRegionTag>
                        ))}
                    </SelectedRegionsList>
                </SelectedRegionsSection>

                <ActionButtons>
                    <ResetButton onClick={handleReset}>
                        <ResetIcon>
                            <svg
                                width='16'
                                height='16'
                                viewBox='0 0 24 24'
                                fill='none'
                            >
                                <path
                                    d='M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z'
                                    fill='#666'
                                />
                            </svg>
                        </ResetIcon>
                        초기화
                    </ResetButton>
                    <ApplyButton
                        onClick={handleApply}
                        disabled={regions.length === 0}
                    >
                        {regions.length}개 지역 적용하기
                    </ApplyButton>
                </ActionButtons>
            </Modal>
        </Overlay>
    );
};

export default RegionFilter;

const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #ffffff;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    overflow: hidden;
`;

const Modal = styled.div`
    width: 100%;
    height: 100%;
    background: #ffffff;
    display: flex;
    flex-direction: column;
    overflow: hidden;
`;

const Header = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px 20px;
    position: relative;
    border-bottom: 1px solid #f0f0f0;
`;

const Title = styled.h2`
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 18px;
    color: #333;
    margin: 0;
`;

const CloseButton = styled.button`
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
        width: 15px;
        height: 15px;
    }
`;

const Instruction = styled.p`
    font-family: 'Pretendard';
    font-size: 14px;
    color: #666;
    margin: 16px 20px 12px 20px;
`;

const SearchContainer = styled.div`
    padding: 0 20px 12px 20px;
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const SearchInputWrapper = styled.div`
    position: relative;
    width: 100%;
`;

const SearchInput = styled.input`
    width: 100%;
    height: 44px;
    padding: 0 44px 0 16px;
    border: 1px solid #d9d9d9;
    border-radius: 12px;
    font-size: 15px;
    font-family: 'Pretendard';
    color: #333;

    &:focus {
        outline: none;
        border-color: #399982;
    }

    &::placeholder {
        color: #999;
    }
`;

const SearchIcon = styled.div`
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    justify-content: center;

    img {
        width: 20px;
        height: 20px;
    }
`;

const LocationIcon = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`;

const SearchResults = styled.div`
    max-height: 200px;
    overflow-y: auto;
    margin: 0 20px 12px 20px;
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    background: #fff;
`;

const SearchResultItem = styled.div`
    padding: 12px 16px;
    font-family: 'Pretendard';
    font-size: 14px;
    color: #333;
    cursor: pointer;
    border-bottom: 1px solid #f0f0f0;

    &:last-child {
        border-bottom: none;
    }

    &:hover {
        background: #f8fffe;
    }
`;

const Tabs = styled.div`
    display: flex;
    padding: 0 20px;
    border-bottom: 1px solid #e0e0e0;
    gap: 8px;
`;

interface TabProps {
    $active?: boolean;
}

interface RegionItemProps {
    $selected?: boolean;
}

const Tab = styled.button<TabProps>`
    padding: 12px 16px;
    font-family: 'Pretendard';
    font-size: 14px;
    font-weight: 500;
    color: ${(props) =>
        props.$active ? '#399982' : '#666'};
    background: none;
    border: none;
    border-bottom: 2px solid
        ${(props) =>
            props.$active ? '#399982' : 'transparent'};
    cursor: pointer;
    transition: all 0.2s ease;
`;

const RegionColumns = styled.div`
    flex: 1;
    display: flex;
    overflow: hidden;
    min-height: 300px;
`;

const RegionColumn = styled.div`
    flex: 1;
    overflow-y: auto;
    padding: 8px 0;
`;

const RegionItem = styled.div<RegionItemProps>`
    padding: 12px 20px;
    font-family: 'Pretendard';
    font-size: 15px;
    color: ${(props) =>
        props.$selected ? '#399982' : '#333'};
    background: ${(props) =>
        props.$selected ? '#f8fffe' : 'transparent'};
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: background 0.2s ease;

    &:hover {
        background: ${(props) =>
            props.$selected ? '#f8fffe' : '#f9f9f9'};
    }
`;

const CheckIcon = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`;

const SelectedRegionsSection = styled.div`
    padding: 16px 20px;
    border-top: 1px solid #f0f0f0;
    background: #fafafa;
`;

const SelectedRegionsInfo = styled.p`
    font-family: 'Pretendard';
    font-size: 13px;
    color: #666;
    margin: 0 0 12px 0;
`;

const SelectedRegionsList = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
`;

const SelectedRegionTag = styled.div`
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 12px;
    background: #399982;
    color: #fff;
    border-radius: 20px;
    font-family: 'Pretendard';
    font-size: 13px;
    font-weight: 500;
`;

const RemoveButton = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 4px;

    img {
        width: 14px;
        height: 14px;
        filter: brightness(0) invert(1);
    }
`;

const ActionButtons = styled.div`
    display: flex;
    gap: 12px;
    padding: 16px 20px;
    border-top: 1px solid #f0f0f0;
    background: #fff;
`;

const ResetButton = styled.button`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 14px;
    background: #fff;
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    font-family: 'Pretendard';
    font-size: 15px;
    color: #666;
    cursor: pointer;
`;

const ResetIcon = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`;

const ApplyButton = styled.button`
    flex: 2;
    padding: 14px;
    background: ${(props) =>
        props.disabled ? '#e0e0e0' : '#399982'};
    border: none;
    border-radius: 12px;
    font-family: 'Pretendard';
    font-size: 15px;
    font-weight: 600;
    color: ${(props) =>
        props.disabled ? '#999' : '#ffffff'};
    cursor: ${(props) =>
        props.disabled ? 'not-allowed' : 'pointer'};
    transition: background 0.2s ease;

    &:hover:not(:disabled) {
        background: #256857;
    }
`;
