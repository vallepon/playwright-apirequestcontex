import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker'
import { APIHelper } from './apiHelpers';
import { generateRandomPostPayload } from './testData';
import exp from 'constants';


const BASE_URL =`http://localhost:3000`;

test.describe("Test suite backend v2", () => {
 let apiHelper: APIHelper;

  test.beforeAll(() => {
    apiHelper = new APIHelper(BASE_URL);
  })

  test('Test case 01 - Get all posts v2', async ({ request }) => {
    const getPosts = await apiHelper.getAllPosts(request);
    expect(getPosts.ok()).toBeTruthy();
 });

  test('Test case 02 - create posts v2', async ({ request }) => {
    const payload = generateRandomPostPayload();
    const CreatePostResponse = await apiHelper.createPost(request, payload);
    expect(CreatePostResponse.ok()).toBeTruthy();
   
    // veifying from the POST request
    expect(await CreatePostResponse.json()).toMatchObject({
      title: payload.title,
      views: payload.views
    })
    // veifying from the GET request
    const getPosts = await apiHelper.getAllPosts(request);
    expect(getPosts.ok()).toBeTruthy();
    expect(await getPosts.json()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: payload.title,
          views: payload.views,
        })
      ])
    )
  });

  test('Test case 03 - Delete Post - v2', async ({ request }) => {
    const getPosts = await apiHelper.getAllPosts(request);
    expect(getPosts.ok()).toBeTruthy();
    const allPosts = await getPosts.json();
    const lastButOneID = allPosts[allPosts.length - 2].id;

    // DELETE request
    const deleteRequest = await apiHelper.deletePost(request, lastButOneID);
    expect(deleteRequest.ok()).toBeTruthy();

    //GET by ID status as 404
    const getPostById = await apiHelper.getByID(request, lastButOneID);
    expect(getPostById.status()).toBe(404);


 });

  /** 
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
    });*/
})




