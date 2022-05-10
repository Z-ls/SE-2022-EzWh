const POS = require("../model/position");
const posRepository = require("../persistence/positionRepository");

const getPositions = async(req, res) => {
    const posRep = new posRepository();
 /*   await posRep.dropTable();
    await posRep.newTablePOS();
    await posRep.addPOS(new POS("302110112022", "3021", "1011", "2022", 100, 100, 0, 0)); */
    const poslist = await posRep.getPOS();
    let message = poslist
    return res.status(200).json(message);
}

const addPosition = async (req, res) => {
    const posRep = new posRepository();
    if(req.body.positionID === (req.body.aisleID+req.body.row+req.body.col)){
    const created = await posRep.addPOS(req.body);
    return created ? res.status(201).send('Created') : res.status(422).send('Unprocessable Entity');
}
return res.status(422).send('Unprocessable Entity');
}

const editPosition = async (req, res) => {
    const posRep = new posRepository();
    let result = await posRep.getPOSbyID(req.params.positionID);
    if(result.length!==0){
    const modified = await posRep.editPOS(req.body, req.params.positionID);
    return modified ? res.status(200).send('Success') : res.status(404).send();
    }
    return res.status(404).send('Not found');
}

const editPositionID = async (req, res) => {
    const posRep = new posRepository();
    let result = await posRep.getPOSbyID(req.params.positionID);
    if(result.length!==0){
    const modified = await posRep.editPOSID(req.body, req.params.positionID);
    return modified ? res.status(200).send('Success') : res.status(404).send();
}
return res.status(404).send('Not found');
}

const deletePosition = async (req, res) => {
    const posRep = new posRepository();
    const deleted = await posRep.deletePOS(req.params.positionID);
    return deleted ? res.status(204).send('Deleted') : res.status(422).send('Unprocessable Entity');
}

module.exports = {
    getPositions,
    addPosition,
    editPosition,
    editPositionID,
    deletePosition
};