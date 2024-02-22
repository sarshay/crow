import React from "react";
import axios from "axios";

function wpScan({ wpUrl }) {
  const baseUrl = `${wpUrl}/?rest_route=/`;
  const getCategory = async () => {
    return await axios
      .get(`${baseUrl}wp/v2/categories`)
      .then(function (response) {
        return response.data;
      })
      .catch(function (error) {
        throw new Error("Error fetching Category");
      });
  };
  const getInfo = async () => {
    const infoKeyList = [
      "site_icon_url",
      "name",
      "description",
      "url",
      "home",
      "site_logo",
    ];
    return await axios
      .get(`${baseUrl}`, { params: { _fields: `${infoKeyList.join(",")}` } })
      .then(function (response) {
        return response.data;
      })
      .catch(function (error) {
        if (error?.code == "ERR_NETWORK") {
          throw new Error(`${baseUrl} is not a wordpress`);
        } else {
          throw new Error(error);
        }
      });
  };
  const getPost = async (param) => {
    const infoKeyList = [
      "id",
      "title",
      "date",
      "_links",
      "excerpt",
      "categories",
    ];
    return await axios
      .get(`${baseUrl}wp/v2/posts`, {
        params: {
          page: 1,
          _fields: `${infoKeyList.join(",")}`,
          _embed: "wp:featuredmedia",
          ...param,
        },
      })
      .then(function (response) {
        return response.data;
      })
      .catch(function (error) {
        throw new Error("Error fetching Posts");
      });
  };
  const getPostDetail = async (id) => {
    const infoKeyList = [
      "id",
      "title",
      "date",
      "_links",
      "excerpt",
      "categories",
      "content",
    ];
    return await axios
      .get(`${baseUrl}wp/v2/posts/${id}`, {
        params: {
          page: 1,
          _fields: `${infoKeyList.join(",")}`,
          _embed: "wp:featuredmedia"
        },
      })
      .then(function (response) {
        return response.data;
      })
      .catch(function (error) {
        throw new Error("Error fetching Posts");
      });
  };
  return { getCategory, getInfo, getPost, getPostDetail };
}

export default wpScan;
