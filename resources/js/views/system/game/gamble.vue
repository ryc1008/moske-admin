<template>
    <div class="board-content">
        <div class="board-main">
            <img class="error-img" :src="$func.assetsFile('qidai.png')" alt="">
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            path: ''
        }
    },
    activated(){

    },
    methods: {

    }
}
</script>

<style scoped>
.board-main{
    text-align: center;min-height: calc(100vh - 145px);
}
.error-img{
    height: 300px;
    margin-top: 185px;
}
</style>
