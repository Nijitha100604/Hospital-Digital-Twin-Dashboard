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
      { $unwind: {
          path: "$department",
          preserveNullAndEmptyArrays: true 
        } 
      },

      {
        $group: {
          _id: "$departmentName",
          departmentName: { $first: "$departmentName" },
          block: { $first: "$department.block" },
          floor: { $first: "$floor" },
          beds: {
            $push: "$$ROOT"
          }
        }
      },

      {
        $project: {
          _id: 0,
          departmentName: 1,
          block: 1,
          floor: 1,

          beds: {
            $map: {
              input: "$beds",
              as: "bed",
              in: {
                bedId: "$$bed.bedId",
                bedType: "$$bed.bedType",
                status: "$$bed.status",
                occupiedDetails: "$$bed.occupiedDetails",
                departmentId: "$$bed.departmentId"
              }
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