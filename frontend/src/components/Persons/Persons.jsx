import React from 'react';

const Persons = ({ persons, newNumber, onDelete }) => {
    return (
        <div>
            {persons.map(person => (
                <div key={person.id}>
                    {person.name} {person.number}
                    <button onClick={() => onDelete(person.id)}>Delete</button>
                </div>
            ))}
        </div>  
    );
};

export default Persons;