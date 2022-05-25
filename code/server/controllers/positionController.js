const POS = require("../model/position");
const posRepository = require("../persistence/positionRepository");

const getPositions = async() => {
    const posRep = new posRepository();
   /* await posRep.dropTable();
    await posRep.newTablePOS();
    await posRep.addPOS(new POS("302110112022", "3021", "1011", "2022", 100, 100, 0, 0)); */
    const poslist = await posRep.getPOS();
    //let message = poslist
    return poslist;//res.status(200).json(message);
}

const addPosition = async (newPosition) => { 
    const posRep = new posRepository();
    if(newPosition.positionID === (newPosition.aisleID+newPosition.row+newPosition.col)){
    const created = await posRep.addPOS(newPosition);
    return created;// ? res.status(201).send('Created') : res.status(422).send('Unprocessable Entity');
}
return undefined;//res.status(422).send('Unprocessable Entity');
}

const editPosition = async (newPos, id) => {
    const posRep = new posRepository();
    const editedpos = await posRep.editPOS(newPos, id);
    return editedpos;
}

const editPositionID = async (newID, id) => {
    const posRep = new posRepository();
    const editedid = await posRep.editPOSID(newID, id);
    return editedid;
}

const deletePosition = async (id) => {
    const posRep = new posRepository();
    const deleted = await posRep.deletePOS(id);
    return deleted;//? res.status(204).send('Deleted') : res.status(422).send('Unprocessable Entity');
}

module.exports = {
    getPositions,
    addPosition,
    editPosition,
    editPositionID,
    deletePosition
};