// statue 타입에 맞게 스타일 변경하는 함수
export const statusToStyle = (status) => {
    switch (status) {
        case 'SUBMITTED':
            return {
                color: '#999999',
                background: '#ffffff',
            };
        case 'SHORTLISTED':
            return {
                color: '#999999',
                background: '#ffffff',
            };
        case 'ACCEPTED':
            return {
                color: '#ffffff',
                background: '#2de283',
            };
        case 'REJECTED':
            return {
                color: '#dc0000',
                background: '#ffffff',
            };
        case 'CANCELLED':
            return {
                color: '#999999',
                background: '#ffffff',
                disable: true,
            };
        case 'EXPIRED':
            return {
                color: '#999999',
                background: '#ffffff',
            };
        case 'DELETED':
            return {
                color: '#999999',
                background: '#ffffff',
            };
        default:
            return {
                color: '#999999',
                background: '#ffffff',
            };
    }
};

// 지원 상태를 한국어로 변환하는 함수
export const statusToKorean = (status) => {
    switch (status) {
        case 'SUBMITTED':
            return '지원됨';
        case 'SHORTLISTED':
            return '서류합격';
        case 'ACCEPTED':
            return '최종합격';
        case 'REJECTED':
            return '불합격';
        case 'CANCELLED':
            return '지원취소';
        case 'EXPIRED':
            return '지원만료';
        case 'DELETED':
            return '삭제됨';
        default:
            return '알수없음';
    }
};
