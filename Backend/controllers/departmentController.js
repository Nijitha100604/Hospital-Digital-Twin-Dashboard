import departmentModel from "../models/departmentModel.js";

// Add department
const addDepartment = async(req, res) =>{
    try{

        const { 
            deptName, 
            deptType, 
            specialityLevel, 
            status, 
            block, 
            floor, 
            hod, 
            contact, 
            totRooms, 
            genBeds, 
            icuBeds, 
            otBeds,
            equipments,
            powerbackup,
            fireExtinguisher,
            oxygenSupply
        } = req.body;

        if( 
            !deptName ||
            !deptType ||
            !specialityLevel ||
            !status ||
            !block ||
            !floor ||
            !hod ||
            !contact ||
            totRooms === undefined ||
            genBeds === undefined ||
            icuBeds === undefined ||
            otBeds === undefined ||
            !Array.isArray(equipments) ||
            typeof powerbackup !== "boolean" ||
            typeof fireExtinguisher !== "boolean" ||
            typeof oxygenSupply !== "boolean"
        ){
            return res.json({success: false, message: "Missing Details"});
        }

        const deptData = {
            deptName, 
            deptType, 
            specialityLevel, 
            status, 
            block, 
            floor, 
            hod, 
            contact,
            beds:{
                total: totRooms,
                general: genBeds,
                icu: icuBeds,
                ot: otBeds
            },
            equipments,
            powerbackup,
            fireExtinguisher,
            oxygenSupply
        }

        const newDept = new departmentModel(deptData);
        await newDept.save();
        res.json({success: true, message: "Department Added Successfully"});

    } catch(error){
        console.log(error);
        res.json({success: false, message: error.message});
    }
}

// all departments
const allDepartments = async(req, res) =>{
    try{
        const departments = await departmentModel.find().sort({ createdAt: -1 });
        return res.json({success: true, data: departments});
    } catch(error){
        console.log(error);
        return res.json({success: false, message: error.message});
    }
}

// department by id
const department = async(req, res) =>{
    try{

        const {id} = req.params;
        const dept = await departmentModel.findOne({deptId: id});
        if(!dept){
            return res.json({success: false, message: "Department not found"});
        }
        return res.json({success: true, data: dept});

    } catch(error){
        console.log(error);
        return res.json({success: false, message: error.message});
    }
}

// Activate or deactive a department
const updateDeptStatus = async(req, res) =>{
    try{

        const {id} = req.params;
        const dept = await departmentModel.findOne({deptId: id});
        if(!dept){
            return res.json({success: false, message: "Department not found"});
        }
        dept.status = dept.status === "Active" ? "Inactive" : "Active";
        await dept.save();
        return res.json({success: true, message: "Department Status Modified"});

    } catch(error){
        console.log(error);
        return res.json({success: false, message: error.message});
    }
}

export {
    addDepartment,
    allDepartments,
    department,
    updateDeptStatus
}