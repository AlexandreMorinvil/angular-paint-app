// import { expect } from 'chai';
// import { describe } from 'mocha';
// import { Db, MongoClient } from 'mongodb';
// import { MongoMemoryServer } from 'mongodb-memory-server';
// import { DatabaseService } from './database.service';
// import { Course } from '@app/schema/course';

// describe('Database service', () => {

//     let databaseService: DatabaseService;
//     let mongoServer: MongoMemoryServer;
//     let db: Db;
//     let client: MongoClient;
//     let testCourse: Course;

//     beforeEach(async () => {

//         databaseService = new DatabaseService();

//         // Start a local test server
//         mongoServer = new MongoMemoryServer();
//         const mongoUri = await mongoServer.getUri();
//         client = await MongoClient.connect(mongoUri, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//         });

//         // We use the local Mongo Instance and not the production database
//         db = client.db(await mongoServer.getDbName());
//         databaseService.collection = db.collection('test');

//         testCourse = { name: "Test Course", subjectCode: "LOG1001", credits: 1, teacher: "John Doe" };
//         databaseService.collection.insertOne(testCourse);
//     });

//     afterEach(async () => {
//         client.close();
//     })

//     it('should get all courses from DB', async () => {
//         let courses = await databaseService.getAllCourses();
//         expect(courses.length).to.equal(1);
//         expect(testCourse).to.deep.equals(courses[0]);
//     });

//     it('should get specific course with valid subjectCode', async () => {
//         let course = await databaseService.getCourse("LOG1001");
//         expect(course).to.deep.equals(testCourse);
//     });

//     it('should get null with an invalid subjectCode', async () => {
//         let course = await databaseService.getCourse("INF001");
//         expect(course).to.deep.equals(null);
//     });

//     it('should get specific course teacher with valid subjectCode', async () => {
//         let teacher = await databaseService.getCourseTeacher("LOG1001");
//         expect(teacher).to.equals(testCourse.teacher);
//     });

//     it('should get specific course based on its teacher', async () => {
//         let secondCourse: Course = { name: "Test Course 2", subjectCode: "LOG1002", credits: 1, teacher: "Jane Doe" };
//         databaseService.collection.insertOne(secondCourse);
//         const courses = await databaseService.getCoursesByTeacher(secondCourse.teacher);
//         expect(courses.length).to.equals(1);
//         expect(courses[0].teacher).to.equals(secondCourse.teacher);
//         expect(courses[0].teacher).to.not.equals(testCourse.teacher);

//     });

//     it('should insert a new course', async () => {
//         let secondCourse: Course = { name: "Test Course 2", subjectCode: "LOG1002", credits: 1, teacher: "John Doe" };

//         await databaseService.addCourse(secondCourse);
//         let courses = await databaseService.collection.find({}).toArray();
//         expect(courses.length).to.equal(2);
//         expect(courses.find(x => x.name === secondCourse.name)).to.deep.equals(secondCourse);
//     });

//     it('should not insert a new course if it has an invalid subjectCode and credits', async () => {
//         let secondCourse: Course = { name: "Test Course 2", subjectCode: "CIV1002", credits: 9, teacher: "John Doe" };
//         try {
//             await databaseService.addCourse(secondCourse);
//         }
//         catch {
//             let courses = await databaseService.collection.find({}).toArray();
//             expect(courses.length).to.equal(1);
//         }
//     });

//     it('should modify an existing course data if a valid subjectCode is sent', async () => {
//         let modifiedCourse: Course = { name: "Test Course 2", subjectCode: "LOG1001", credits: 2, teacher: "Jane Doe" };

//         await databaseService.modifyCourse(modifiedCourse);
//         let courses = await databaseService.collection.find({}).toArray();
//         expect(courses.length).to.equal(1);
//         expect(courses.find(x => x.subjectCode === testCourse.subjectCode)?.name).to.deep.equals(modifiedCourse.name);
//     });

//     it('should not modify an existing course data if no valid subjectCode is passed', async () => {
//         let modifiedCourse: Course = { name: "Test Course 2", subjectCode: "LOG1002", credits: 2, teacher: "Jane Doe" };

//         await databaseService.modifyCourse(modifiedCourse);
//         let courses = await databaseService.collection.find({}).toArray();
//         expect(courses.length).to.equal(1);
//         expect(courses.find(x => x.subjectCode === testCourse.subjectCode)?.name).to.not.equals(modifiedCourse.name);
//     });

//     it('should delete an existing course data if a valid subjectCode is sent', async () => {
//         await databaseService.deleteCourse("LOG1001");
//         let courses = await databaseService.collection.find({}).toArray();
//         expect(courses.length).to.equal(0);
//     });

//     it('should not delete a course if it has an invalid subjectCode ', async () => {
//         try {
//             await databaseService.deleteCourse("LOG1002");
//         }
//         catch {
//             let courses = await databaseService.collection.find({}).toArray();
//             expect(courses.length).to.equal(1);
//         }
//     });

// });
