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

        if (!latitude || !longitude) {
            return res.status(400).json({ message: 'Please provide latitude and longitude' });
        }

        latitude = parseFloat(latitude);
        longitude = parseFloat(longitude);

        if (isNaN(latitude) || isNaN(longitude)) {
            return res.status(400).json({ message: 'Latitude and longitude must be valid numbers' });
        }

        const sql = `
            SELECT 
                id,
                name,
                address,
                latitude,
                longitude,
                ST_Distance_Sphere(
                    POINT(longitude, latitude), 
                    POINT(?, ?)
                ) / 1000 AS distance_km
            FROM school
            ORDER BY distance_km ASC
        `;

        const [rows] = await db.query(sql, [longitude, latitude]);

        res.status(200).json(rows);

    } catch (err) {
        console.error('Error Occurred:', err.message, err.sqlMessage || '');
        res.status(500).json({ err: 'Internal Server Error', details: err.message });
    }
});

module.exports=router;