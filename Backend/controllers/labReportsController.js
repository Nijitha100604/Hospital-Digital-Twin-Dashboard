// All Lab Reports
import labReportModel from './../models/labReportModel.js';

const allReports = async(req, res) =>{

    try{

        const reports = await labReportModel.find({}).sort({createdAt: -1});
        return res.json({success: true, data: reports});

    } catch(error){
        console.log(error);
        res.json({success: false, message: error.message});
    }

}

export {
    allReports
}