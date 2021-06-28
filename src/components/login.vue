<template>
  <div class="login">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="没有头像">
      </div>
      <el-form  label-width="0px" class="login_form">
        <el-form-item>
          <el-input ></el-input>
        </el-form-item>
        <el-form-item>
          <el-input ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">主要按钮</el-button>
          <el-button type="info">信息按钮</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>

export default {}
</script>
<style lang="scss" scoped>
  .login {
    background-color: #2b4b6b;
    height: 100%;
  }

  .login_box {
    width: 450px;
    height: 450px;
    background-color: white;
    border-radius: 5px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  .avatar_box{
    width: 130px;
    height: 130px;
    border: 1px solid  #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px  #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%,-50%);
    background-color: #eeeeee;
    img{
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
  .login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }
</style>
