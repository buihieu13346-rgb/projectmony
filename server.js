const express=require("express");
const cors=require("cors");
const fs=require("fs");


const app=express();


app.use(cors());
app.use(express.json());



function readUsers(){

return JSON.parse(
fs.readFileSync("users.json")
);

}



function saveUsers(data){

fs.writeFileSync(
"users.json",
JSON.stringify(data,null,2)
);

}




// đăng nhập

app.post("/login",(req,res)=>{


let {
username,
password,
device
}=req.body;



let users=readUsers();



let user=
users.find(
u=>u.username==username
);



// tạo tài khoản mới

if (!user) {
    return res.json({
        ok: false,
        msg: "Tài khoản không tồn tại"
    });
}


saveUsers(users);


return res.json({

ok:true

});


}




// sai mật khẩu

if(user.password!=password){

return res.json({

ok:false,
msg:"Sai mật khẩu"

});

}




// khác thiết bị

if(user.device!=device){

return res.json({

ok:false,

msg:"Tài khoản đang dùng trên thiết bị khác"

});

}



res.json({

ok:true

});



});





app.use(
express.static(".")
);



app.listen(3000,()=>{

console.log(
"Server chạy tại http://localhost:3000"
);

});
