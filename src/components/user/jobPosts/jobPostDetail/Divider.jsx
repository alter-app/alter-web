import styled from 'styled-components';

const Divider = () => {
    return <DividerLine />;
};

export default Divider;

const DividerLine = styled.div`
    width: 100%;
    height: 5px;
    background-color: #f5f5f5;
    border: none;
    margin: 0;
    padding: 0;
`;
