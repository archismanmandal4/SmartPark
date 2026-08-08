const Parking = require("../models/Parking");


// ===============================
// GET ALL PARKING SPOTS
// ===============================

exports.getParkings = async(req, res) => {

    try {

        const parkings = await Parking.find();

        res.status(200).json(parkings);


    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};




// ===============================
// ADD NEW PARKING SPOT
// ===============================

exports.createParking = async(req, res) => {

    try {


        const {
            name,
            location,
            totalSlots,
            availableSlots
        } = req.body;



        const parking = new Parking({

            name,

            location,

            totalSlots,

            availableSlots

        });



        const savedParking = await parking.save();



        res.status(201).json(savedParking);



    } catch (error) {


        res.status(500).json({

            message: error.message

        });


    }

};




// ===============================
// GET SINGLE PARKING BY ID
// ===============================

exports.getParkingById = async(req, res) => {


    try {


        const parking =
            await Parking.findById(req.params.id);



        if (!parking) {

            return res.status(404).json({

                message: "Parking not found"

            });

        }



        res.status(200).json(parking);



    } catch (error) {


        res.status(500).json({

            message: error.message

        });


    }


};




// ===============================
// UPDATE PARKING
// ===============================

exports.updateParking = async(req, res) => {


    try {


        const parking =
            await Parking.findByIdAndUpdate(

                req.params.id,

                req.body,

                {
                    new: true
                }

            );



        if (!parking) {

            return res.status(404).json({

                message: "Parking not found"

            });

        }



        res.status(200).json(parking);



    } catch (error) {


        res.status(500).json({

            message: error.message

        });


    }


};




// ===============================
// DELETE PARKING
// ===============================

exports.deleteParking = async(req, res) => {


    try {


        const parking =
            await Parking.findByIdAndDelete(
                req.params.id
            );



        if (!parking) {

            return res.status(404).json({

                message: "Parking not found"

            });

        }



        res.status(200).json({

            message: "Parking deleted successfully"

        });



    } catch (error) {


        res.status(500).json({

            message: error.message

        });


    }


};