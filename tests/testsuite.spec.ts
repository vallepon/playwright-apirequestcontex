import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker'
import { title } from 'process';


test.describe("Test suite backend v1", () => {
  test('Test case 01 - Get all posts', async ({ request }) => {
    const getPostResponse = await request.get("http://localhost:3000/posts");
    expect (getPostResponse.ok()).toBeTruthy();
    expect (getPostResponse.status()).toBe(200);
  });

  test('Test case 02 - Create posts', async ({ request }) => {
    const payload = {
      title: faker.lorem.sentence(),
      views:faker.number.int({min:10, max:100})
    }

    const CreatePostResponse = await request.post("http://localhost:3000/posts", {
      data:JSON.stringify(payload),
    });
   expect (CreatePostResponse.ok()).toBeTruthy();
 
   // verify that the response of the post method contains the new record. 
  expect (await CreatePostResponse.json()).toMatchObject(
    expect.objectContaining({
      title: payload.title,
      views: payload.views,
    })
  )
  //verify that when you get all the posts, the new record is in there.
  const getPostResponse = await request.get("http://localhost:3000/posts");
  expect (getPostResponse.ok()).toBeTruthy();
  
  const allPost = await getPostResponse.json();
  expect(allPost).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        title: payload.title,
        views: payload.views,
      })
    ])
  )

  });

    test('Test case 03 - Delete Post by ID', async ({ request }) => {
      //Get all posts in the order to access it's elements.
      const getPostResponse = await request.get("http://localhost:3000/posts");
     expect (getPostResponse.ok()).toBeTruthy(); //Assertion
     const allPosts = await getPostResponse.json();
     expect(allPosts.length).toBeGreaterThan(3);
    //retrieve the id of the last element in the array
     const lastButOnePostID = allPosts[allPosts.length - 2].id;
     
     //DELETE request
     const deletePostResponse = await request.delete(`http://localhost:3000/posts/${lastButOnePostID}`);
     expect (deletePostResponse.ok()).toBeTruthy();

     //Verify that the element is gone
     const deletedElementResponse = await request.get(`http://localhost:3000/posts/${lastButOnePostID}`);
     expect (deletedElementResponse.status()).toBe(404);
    });
})




