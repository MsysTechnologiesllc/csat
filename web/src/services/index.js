import axios from "axios";
export class BaseService {
  async post(url, data, callback) {
    return await axios
      .post(url, data)
      .then(async (res) => {
        callback(res);
      })
      .catch((err) => {
        callback(err);
      });
  }
  async delete(url, data, callback) {
    return await axios
      .delete(
        url,
        { data },
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        },
      )
      .then(async (res) => {
        callback(res);
      })
      .catch((err) => {
        callback(err);
      });
  }

  async put(url, data, headers, callback) {
    return await axios
      .put(url, data, headers)
      .then(async (res) => {
        callback(res);
      })
      .catch((err) => {
        callback(err);
      });
  }

  async get(url, callback, headers) {
    console.log(url, callback, headers);
    let header = headers
      ? headers
      : {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          Authorization: "Bearer undefined",
        };
    return await axios
      .get(url, header)
      .then(async (res) => {
        callback(res);
      })
      .catch((err) => {
        callback(err);
      });
  }
}
