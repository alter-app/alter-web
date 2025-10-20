import styled from 'styled-components';
import ScheduleCard from './ScheduleCard';

const SelectedScheduleSection = ({ selectedSchedule }) => {
    return (
        <Section>
            <SectionHeader>
                <SectionIcon>📅</SectionIcon>
                <SectionTitle>선택한 스케줄</SectionTitle>
            </SectionHeader>
            {selectedSchedule ? (
                <ScheduleCard
                    schedule={selectedSchedule}
                    isSelected={false}
                    onSelect={() => {}}
                />
            ) : (
                <Placeholder>
                    스케줄을 선택해주세요
                </Placeholder>
            )}
        </Section>
    );
};

export default SelectedScheduleSection;

const Section = styled.div`
    background: #ffffff;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    border: 1px solid #e9ecef;
`;

const SectionHeader = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
`;

const SectionIcon = styled.span`
    font-size: 20px;
`;

const SectionTitle = styled.h3`
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 18px;
    color: #333333;
    margin: 0;
`;

const Placeholder = styled.div`
    padding: 40px 20px;
    text-align: center;
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 14px;
    color: #999999;
    background: #f8f9fa;
    border-radius: 12px;
`;
