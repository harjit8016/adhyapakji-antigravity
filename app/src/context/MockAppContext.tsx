import React, { createContext, useState, useContext } from 'react';

const initialStudents = [
    { id: '1', name: 'Aman Sharma', className: 'Class 5A', roll: '12' },
    { id: '2', name: 'Simran Sharma', className: 'Class 2B', roll: '25' },
];

const initialClassStudents = [
    { id: '101', name: 'Rahul Kumar', roll: '1' },
    { id: '102', name: 'Priya Singh', roll: '2' },
    { id: '103', name: 'Amit Patel', roll: '3' },
    { id: '104', name: 'Neha Gupta', roll: '4' },
    { id: '105', name: 'Rohan Mehra', roll: '5' },
    { id: '106', name: 'Sonia Das', roll: '6' },
];

export const MockAppContext = createContext<any>(null);

export function MockAppProvider({ children }: { children: React.ReactNode }) {
    const [myChildren, setMyChildren] = useState(initialStudents);
    const [activeStudentId, setActiveStudentId] = useState<string | null>(null);
    const [classStudents, setClassStudents] = useState(initialClassStudents);

    const [notices, setNotices] = useState([
        { id: 1, title: 'Holiday Alert', description: 'Tomorrow school will remain closed due to heavy rain.', type: 'audio', date: 'Oct 15' },
        { id: 2, title: 'Fee Deadline', description: 'Please pay 2nd term fees by 30th October.', type: 'text', date: 'Oct 10' }
    ]);

    return (
        <MockAppContext.Provider value={{
            myChildren,
            setMyChildren,
            activeStudentId,
            setActiveStudentId,
            classStudents,
            setClassStudents,
            notices
        }}>
            {children}
        </MockAppContext.Provider>
    );
}

export function useMockApp() {
    return useContext(MockAppContext);
}
