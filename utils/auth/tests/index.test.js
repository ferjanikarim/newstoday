const { getToken } = require("..");

describe("Utils | Auth", () => {
  it("Should get a token", () => {
    const user = {
      email: "aziz@gmail.com",
      isBanned: true,
      isAdmin: true,
      isVerified: true,
      isUser: true,
      id: "123",
    };
    expect(getToken(user)).not.toBeNull();
  });
});
