// statue 타입에 맞게 스타일 변경하는 함수
export const statusToStyle = (status) => {
    switch (status) {
        case 'SUBMITTED':
            return {
                color: '#ffffff',
                background: '#4a90e2',
            };
        case 'SHORTLISTED':
            return {
                color: '#ffffff',
                background: '#9b59b6',
            };
        case 'ACCEPTED':
            return {
                color: '#ffffff',
                background: '#2de283',
            };
        case 'REJECTED':
            return {
                color: '#ffffff',
                background: '#dc0000',
            };
        case 'CANCELLED':
            return {
                color: '#666666',
                background: '#e9ecef',
            };
        case 'EXPIRED':
            return {
                color: '#666666',
                background: '#e9ecef',
            };
        case 'DELETED':
            return {
                color: '#666666',
                background: '#e9ecef',
            };
        default:
            return {
                color: '#666666',
                background: '#e9ecef',
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
