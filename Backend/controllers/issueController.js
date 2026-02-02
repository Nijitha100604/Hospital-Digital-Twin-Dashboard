import issueModel from "../models/issueModel.js";

// Create issue
const createIssue = async(req, res) =>{
    try{

        const { issueType, priorityLevel, location, block, description, reportedBy, reporterId } = req.body;
        
        if(!issueType || !priorityLevel || !location || !block || !description){
            return res.json({success: false, message: "Missing required fields"});
        }

        const issueData = {
            issueType,
            priorityLevel,
            location: location.trim(), 
            block,
            description: description.trim(),
            reportedBy,
            reporterId
        }

        const newIssue = new issueModel(issueData);
        await newIssue.save();

        return res.json({success: true, message: "Issue Created Successfully"});

    }catch(error){
        console.log(error);
        res.json({success: false, message: error.message});
    }
}

const allIssues = async(req, res) =>{
    try{

        const issues = await issueModel.find().sort({createdAt: -1});
        return res.json({success: true, data: issues});

    } catch(error){
        console.log(error);
        return res.json({success: false, message: error.message});
    }
}

const updateIssue = async(req, res) =>{

    try{

        const { id, status } = req.body;
        if(!id || !status){
            return res.json({success: false, message: "Missing ID or Status"});
        }
        const issue = await issueModel.findOne({issueId : id});
        if(!issue){
            return res.json({success: false, message: "Issue Not Found"});
        }
        issue.status = status;
        await issue.save();
        return res.json({success: true, message: "Issue Status Updated"});

    } catch(error){
        console.log(error);
        res.json({success: false, message: error.message});
    }

}

export {
    createIssue,
    allIssues,
    updateIssue
}