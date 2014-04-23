function Room(id, owner) {
    this.id = id;
    this.owner = owner;
    this.people = [];
    this.available = true;
};

Room.prototype.addPerson = function (personID) {
    if (this.available) {
        this.people.push(personID);
    }
};

Room.prototype.removePerson = function (person) {
    var personIndex = -1;
    for (var i = 0; i < this.people.length; i++) {
        if (this.people[i] === person.id) {
            personIndex = i;
            break;
        }
    }
    this.people.remove(personIndex);
};

Room.prototype.getPerson = function (personID) {
    var person = null;
    for (var i = 0; i < this.people.length; i++) {
        if (this.people[i].id == personID) {
            person = this.people[i];
            break;
        }
    }
    return person;
};

module.exports = Room;