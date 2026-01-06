import styled from 'styled-components';
import AuthButton from './AuthButton';
import { useState, useEffect } from 'react';

const GenderContainer = styled.div`
    display: flex;
    width: 122px;
    height: 56px;

    @media (max-width: 480px) {
        height: 52px;
    }

    @media (max-width: 360px) {
        height: 48px;
    }
`;

interface GenderSelectorProps {
    value: string;
    onChange: (value: string) => void;
}

const GenderSelector = ({ value, onChange }: GenderSelectorProps) => {
    const [dimensions, setDimensions] = useState({
        height: '56px',
        fontSize: '18px',
        borderRadius: '12px',
    });

    useEffect(() => {
        const updateDimensions = () => {
            if (window.innerWidth <= 360) {
                setDimensions({
                    height: '48px',
                    fontSize: '16px',
                    borderRadius: '8px',
                });
            } else if (window.innerWidth <= 480) {
                setDimensions({
                    height: '52px',
                    fontSize: '17px',
                    borderRadius: '10px',
                });
            } else {
                setDimensions({
                    height: '56px',
                    fontSize: '18px',
                    borderRadius: '12px',
                });
            }
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () =>
            window.removeEventListener(
                'resize',
                updateDimensions
            );
    }, []);

    return (
        <GenderContainer>
            <AuthButton
                type='button'
                onClick={() => onChange('남')}
                $fontSize={dimensions.fontSize}
                width='61px'
                height={dimensions.height}
                $background={
                    value === '남' ? '#2DE283' : '#cbcbcb'
                }
                $borderRadius={`${dimensions.borderRadius} 0 0 ${dimensions.borderRadius}`}
            >
                남
            </AuthButton>
            <AuthButton
                type='button'
                onClick={() => onChange('여')}
                $fontSize={dimensions.fontSize}
                width='61px'
                height={dimensions.height}
                $background={
                    value === '여' ? '#2DE283' : '#cbcbcb'
                }
                $borderRadius={`0 ${dimensions.borderRadius} ${dimensions.borderRadius} 0`}
            >
                여
            </AuthButton>
        </GenderContainer>
    );
};

export default GenderSelector;
