export const createFakeEvents = (types: Array<string> = []) => {
    const events = [
        {
            id: '1',
            type: 'Comment',
            timestamp: '2021-05-15T18:36:06.000Z',
            uId: '49776',
            username: 'terodox@gmail.com',
            firstName: '',
            lastName: '',
            message: 'Let us add another comment'
        },
        {
            id: '2',
            type: 'AddCrashDefect',
            timestamp: '2021-06-19T03:01:12Z',
            uId: '4',
            username: 'Fred',
            firstName: 'Fred',
            lastName: 'Flintstone',
            message: 'Defect 34280 added to crash 86791 by Fred'
        },
        {
            id: '3',
            type: 'RemoveCrashDefect',
            timestamp: '2021-06-19T03:01:07Z',
            uId: '4',
            username: 'Fred',
            firstName: 'Fred',
            lastName: 'Flintstone',
            message: 'Defect association removed from crash 86791 by Fred'
        },
        {
            id: '4',
            type: 'AddStackKeyDefect',
            timestamp: '2021-06-19T03:01:12Z',
            uId: '4',
            username: 'Fred',
            firstName: 'Fred',
            lastName: 'Flintstone',
            message: 'Defect 34280 added to crash 86791 by Fred'
        },
        {
            id: '5',
            type: 'RemoveStackKeyDefect',
            timestamp: '2021-06-19T03:01:07Z',
            uId: '4',
            username: 'Fred',
            firstName: 'Fred',
            lastName: 'Flintstone',
            message: 'Defect association removed from crash 86791 by Fred'
        },
    ];

    if (types.length) {
        return events.filter(event => types.some(type => type === event.type));
    }

    return events;
};