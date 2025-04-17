import styled from "styled-components";
import AuthButton from "./AuthButton";

const GenderContainer = styled.div`
    display: flex;
    width: 122px;
`;

const GenderSelector = ({ value, onChange }) => {
    return (
        <GenderContainer>
            <AuthButton
                type="button"
                onClick={() => onChange("남")}
                font_size="18px"
                width="61px"
                background={
                    value === "남" ? "#2DE283" : "#cbcbcb"
                }
                border_radius="8px 0 0 8px"
            >
                남
            </AuthButton>
            <AuthButton
                type="button"
                onClick={() => onChange("여")}
                font_size="18px"
                width="61px"
                background={
                    value === "여" ? "#2DE283" : "#cbcbcb"
                }
                border_radius="0 8px 8px 0"
            >
                여
            </AuthButton>
        </GenderContainer>
    );
};

export default GenderSelector;
