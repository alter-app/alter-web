import styled from 'styled-components';

const Loader = () => {
    return <Div />;
};

export default Loader;

const Div = styled.div`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 3px solid rgba(0, 0, 0, 0.2);
    border-top-color: #000;
    animation: spin 0.7s linear infinite;

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }
`;
