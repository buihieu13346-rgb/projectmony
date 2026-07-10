const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("."));

// Đọc users.json
function readUsers() {
    return JSON.parse(
        fs.readFileSync("users.json", "utf8")
    );
}

// Ghi users.json
function saveUsers(users) {
    fs.writeFileSync(
        "users.json",
        JSON.stringify(users, null, 2)
    );
}

// Đăng nhập
app.post("/login", (req, res) => {

    const {
        username,
        password,
        device
    } = req.body;

    const users = readUsers();

    const user = users.find(
        u => u.username === username
    );

    // Không tồn tại tài khoản
    if (!user) {
        return res.json({
            ok: false,
            msg: "Tài khoản không tồn tại"
        });
    }

    // Sai mật khẩu
    if (user.password !== password) {
        return res.json({
            ok: false,
            msg: "Sai mật khẩu"
        });
    }

    // Lần đầu đăng nhập -> lưu thiết bị
    if (!user.device || user.device === "") {

        user.device = device;

        saveUsers(users);

        return res.json({
            ok: true
        });

    }

    // Khác thiết bị
    if (user.device !== device) {
        return res.json({
            ok: false,
            msg: "Tài khoản đang được sử dụng trên thiết bị khác"
        });
    }

    // Đăng nhập thành công
    return res.json({
        ok: true
    });

});

// Chạy server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server đang chạy tại cổng " + PORT);
});
