export const genderToKorean = (gender) => {
    switch (gender) {
        case 'GENDER_MALE':
            return '남성';
        case 'GENDER_FEMALE':
            return '여성';
        default:
            return '정보 없음';
    }
};
