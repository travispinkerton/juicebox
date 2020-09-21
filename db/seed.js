const {
    client,
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    createPost,
    updatePost,
    getAllPosts,
    getPostsByUser,
    getPostsByTagName
} = require('./index');



async function createInitialUsers() {
    try {
      console.log("Starting to create users...");
  
      await createUser({ username: 'albert', password: 'bertie99' , name: "alberto", location: "Disneyworld"});
      await createUser({ username: 'sandra', password: '2sandy4me', name: "sandy", location: "Pluto" });
      await createUser({ username: 'glamgal', password: 'soglam', name: "gina", location: "Lake Shasta" });
  
      console.log("Finished creating users!");
    } catch (error) {
      console.error("Error creating users!");
      throw error;
    }
}
  
async function createInitialPosts() {
    try {
      const [albert, sandra, glamgal] = await getAllUsers();
  
      await createPost({
        authorId: albert.id,
        title: "First Post",
        content: "This is my first post. I hope I love writing blogs as much as I love writing them.",
        tags: ["#holdmeclosertinydancer", "#scooby-snacks"]
         
      });

      await createPost({
        authorId: sandra.id,
        title: "First Post",
        content: "This is my first post. I hope I love writing blogs as much as I love writing them.",
        tags: ["#the ole switcheroo","#hitthegroundrunning"]
        
      });

      await createPost({
        authorId: glamgal.id,
        title: "First Post",
        content: "This is my first post. I hope I love writing blogs as much as I love writing them.",
        tags: ["#itoldthemiinventedtimesnewroman","#sharknado7"]
        
      });
      await createPost({
        authorId: glamgal.id,
        title: "First Post",
        content: "This is my first post. I hope I love writing blogs as much as I love writing them.",
        tags: ["#itoldthemiinventedtimesnewroman","#sharknado7"]
        
      });
  
      // a couple more
    } catch (error) {
      throw error;
    }
}

async function dropTables() {
    try {
      console.log("Starting to drop tables...");
        await client.query(`
        DROP TABLE IF EXISTS post_tags;
        DROP TABLE IF EXISTS tags;
        DROP TABLE IF EXISTS posts;
        DROP TABLE IF EXISTS users;
        
      `);
  
      console.log("Finished dropping tables!");
    } catch (error) {
      console.error("Error dropping tables!");
      throw error;
    }
}

async function createTables() {
    try {
      console.log("Starting to build tables...");
  
      await client.query(`
        CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          username varchar(255) UNIQUE NOT NULL,
          password varchar(255) NOT NULL,
          name VARCHAR(255) NOT NULL,
          location VARCHAR(255) NOT NULL,
          active BOOLEAN DEFAULT true
        );
        CREATE TABLE posts (
            id SERIAL PRIMARY KEY,
            "authorId" INTEGER REFERENCES users(id) NOT NULL,
            title VARCHAR(255) NOT NULL,
            content TEXT NOT NULL,
            active BOOLEAN DEFAULT true
        );
        CREATE TABLE tags (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) UNIQUE NOT NULL
        );
        CREATE TABLE post_tags (
            "postId" INT REFERENCES posts(id),
            "tagId" INT REFERENCES tags(id),
            UNIQUE ("postId", "tagId")
        );
        `);
        
  
      console.log("Finished building tables!");
    } catch (error) {
      console.error("Error building tables!");
      throw error;
    }
}

 
async function rebuildDB() {
    try {
      client.connect();
      await dropTables();
      await createTables();
      await createInitialUsers();
      await createInitialPosts();
    } catch (error) {
      throw error;
    }
}

  
  
async function testDB() {
    try {
      console.log("Starting to test database...");
  
      console.log("Calling getAllUsers");
      const users = await getAllUsers();
      console.log("Result:", users);
  
      console.log("Calling updateUser on users[0]");
      const updateUserResult = await updateUser(users[0].id, {
        name: "Newname Sogood",
        location: "Lesterville, KY"
      });
      console.log("Result:", updateUserResult);
      const postId = await getPostsByUser(1)
      console.log("Result:", postId);
      console.log("Calling getAllPosts");
      const posts = await getAllPosts();
      console.log("Result:", posts);
  
      console.log("Calling updatePost on posts[0]");
      const updatePostResult = await updatePost(posts[0].id, {
        title: "New Title",
        content: "Updated Content"
      });
      console.log("Result:", updatePostResult);

      console.log("Calling getUserById with 1");
      const albert = await getUserById(1);
      console.log("Result:", albert);

      console.log("Calling getPostsByTagName with #holdmecloser");
      const postsWithHappy = await getPostsByTagName("#holdmeclosertinydancer");
      console.log("Result:", postsWithHappy);

      console.log("Calling updatePost on posts[1], only updating tags");
      const updatePostTagsResult = await updatePost(posts[0].id, {
      tags: ["#youcandoanything", "#redfish", "#bluefish"]
      });
      console.log("Result:", updatePostTagsResult);


      
      console.log("Finished database tests!");
      } catch (error) {
      console.error("Error during testDB");
      throw error;
    }
}
  
rebuildDB()
    .then(testDB)
    .catch(console.error)
    .finally(() => client.end());