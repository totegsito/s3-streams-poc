require('dotenv').config();
const { S3 } = require('aws-sdk');
const { pipeline } = require('stream');
const { Transform } = require('json2csv');
const putaMierda = require('handy-postgres');
const s3UploadStream = require('s3-upload-stream');

const { start, stop } = putaMierda({});

(async () => {
    // Database setup
    const pool = await start({
        pg: {
            user: process.env.DATABASE_USER,
            host: process.env.DATABASE_HOST,
            database: process.env.DATABASE_NAME,
            password: process.env.DATABASE_PASSWORD,
            port: process.env.DATA_BASE_PORT,
        }
    });

    // S3 stream client setup
    const s3 = new S3({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });

    const s3StreamClient = s3UploadStream(s3);

    // S3 bucket name
    const bucketName = process.env.S3_BUCKET_NAME;

    // Options for json2csv
    const csvOptions = {
        header: true,
    };

    // TODO: Insert the desired query code
    const query = ``;

    // Execute the query and get a stream
    const dbStream = await pool.formattedStreamQuery(query);

    // Transform database query stream to csv stream
    const csvStream = new Transform(csvOptions, { encoding: 'utf-8', objectMode: true });

    // Create a Writable stream for uploading to S3
    const s3Stream = s3StreamClient.upload({
        Bucket: bucketName,
        Key: new Date().toISOString(),
    }).on('error', (err) => {
        console.error(`Error al subir archivo a S3: ${err}`);
    }).on('httpUploadProgress', (progress) => {
        console.log(`Progreso de subida: ${progress.loaded}/${progress.total}`);
    }).on('uploaded', (details) => {
        console.log(details)
    }).on('part', (details) => {
        console.log(details);
    });

    // Pipeline creation
    try {
        pipeline(
            dbStream,
            csvStream,
            s3Stream,
            (err) => {
                if (err) {
                    console.error(`Error en el pipeline: ${err}`);
                } else {
                    console.log('Datos subidos a S3 correctamente');
                }

                // Close Database connection
                stop();
            },
        );
    } catch (ex) {
        console.error(`Error al crear el pipeline:`, ex);
    }
})();



