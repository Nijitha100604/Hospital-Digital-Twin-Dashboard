import bedAvailabilityModel from "../models/bedAvailabilityModel.js";

// Get beds
const getBeds = async(req, res) =>{
    try {
      
    const beds = await bedAvailabilityModel.aggregate([
      {
        $lookup: {
          from: "departments",
          localField: "departmentId",
          foreignField: "deptId",
          as: "department"
        }
      },
      { $unwind: "$department" },

      {
        $group: {
          _id: "$departmentName",
          departmentName: { $first: "$departmentName" },
          block: { $first: "$department.block" },
          floor: { $first: "$floor" },
          beds: {
            $push: {
              bedId: "$bedId",
              bedType: "$bedType",
              status: "$status"
            }
          }
        }
      },

      { $sort: { departmentName: 1 } }
    ]);

    res.json({ success: true, data: beds });

    } catch (error) {
        console.log(error);
        return res.json({success: false, message: error.message});
    }
}

export {
    getBeds
}