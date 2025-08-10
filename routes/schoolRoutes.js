const express=require('express');
const router=express.Router();
const db=require('./../db');
router.post('/addSchool', async(req, res)=>{
     
    try{
       const{name, address, latitude, longitude}=req.body;
        if(!name || !address || !latitude || !longitude){
           return res.status(401).json({message: 'Please Ensure that you fill all data'});
        }
        const [rows]=await db.query(
            'insert into school (name, address, latitude, longitude) values(?,?,?,?)',
            [name, address, latitude, longitude],
        );
        res.status(200).json({message: 'School Details Added Successfully'});
    }
    catch(err){
        console.log('Error Occured ', err);
        res.status(501).json({err: 'Internal Server Error'});
    }
});
router.get('/listSchool', async (req, res) => {
    try {
        let { latitude, longitude } = req.query;

        // Validation: empty check
        if (!latitude || !longitude) {
            return res.status(400).json({ message: 'Please provide latitude and longitude' });
        }

        // Convert to number
        latitude = parseFloat(latitude);
        longitude = parseFloat(longitude);

        // Validation: NaN check
        if (isNaN(latitude) || isNaN(longitude)) {
            return res.status(400).json({ message: 'Latitude and longitude must be valid numbers' });
        }

        // Haversine formula to calculate distance
        const [rows] = await db.query(
            `SELECT 
                id,
                name,
                address,
                latitude,
                longitude,
                (6371 * ACOS(
                    COS(RADIANS(?)) * COS(RADIANS(latitude)) *
                    COS(RADIANS(longitude) - RADIANS(?)) +
                    SIN(RADIANS(?)) * SIN(RADIANS(latitude))
                )) AS distance_km
             FROM school
             ORDER BY distance_km ASC`,
            [latitude, longitude, latitude] // Order: lat, long, lat
        );

        res.status(200).json(rows);

    } catch (err) {
        console.error('Error Occurred:', err);
        res.status(500).json({ err: 'Internal Server Error' });
    }
});


module.exports=router;