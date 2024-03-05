<template>
    <div>
        <div class="container-fluid">
            <div class="loader">正在登录...</div>
        </div>
    </div>
</template>

<script>
    import {UserAuthorize} from '@/request/agent.js';
    export default {
        data() {
            return {

            }
        },
        created(){
            setTimeout(()=>{
                this.authorize();
            }, 2000);

        },
        methods: {
            authorize() {
                UserAuthorize().then((res) => {
                    if (res.status) {
                        this.$func.error(res.message).then(()=>{
                            window.opener = null;
                            window.open("about:blank", "_top").close();
                        });
                    } else {
                        this.$store.dispatch('userLogin', res.data).then(() => {
                            this.$func.success(res.message).then(() => {
                                this.$router.push({name: 'agent_main'});
                            });
                        });
                    }
                });
            }
        }
    }
</script>
<style scoped>
    .container-fluid {
        background: #fff;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .container-fluid, .container-fluid.padding-lg-h {
        padding-left: 30px;
        padding-right: 30px;
    }

    .container-fluid {
        width: 100%;
        margin-right: auto;
        margin-left: auto;
    }

    .container-fluid .loader {
        width: 250px;
        height: 50px;
        line-height: 50px;
        text-align: center;
        position: absolute;
        top: 50%;
        left: 50%;
        -webkit-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
        font-family: "Helvetica Neue", Helvetica, Arial, "Microsoft Yahei", "Hiragino Sans GB", "Heiti SC", "WenQuanYi Micro Hei", sans-serif;
        text-transform: uppercase;
        font-weight: 900;
        color: #00bcd4;
        letter-spacing: .2em;
    }

    .container-fluid .loader::after, .container-fluid .loader::before {
        content: "";
        display: block;
        width: 15px;
        height: 15px;
        background: #00bcd4;
        position: absolute;
        -webkit-animation: .7s ease-in-out infinite alternate load;
        animation: .7s ease-in-out infinite alternate load;
    }

    .container-fluid .loader::after, .container-fluid .loader::before {
        content: "";
        display: block;
        width: 15px;
        height: 15px;
        background: #00bcd4;
        position: absolute;
        -webkit-animation: .7s ease-in-out infinite alternate load;
        animation: .7s ease-in-out infinite alternate load;
    }

    .container-fluid .loader::before {
        top: 0;
    }

    .container-fluid .loader::after {
        bottom: 0;
    }

    *, ::after, ::before {
        box-sizing: border-box;
    }

    .loading {
        background-color: #fff;
        width: 100%;
        height: 100%;
        position: fixed;
        z-index: 1;

    }

    .loading::before,
    .loading::after {
        position: fixed;
        z-index: 1;
        top: 48%;
        left: 0;

        width: 100%;
        height: 100%;
    }

    .loading::before {
        content: '';

    }

    .mat-icon {
        width: 14px;
        height: 14px;
        font-size: 14px;
        margin-left: 5px;
        vertical-align: middle;
        cursor: pointer
    }

    .jump-mag a {
        color: #28a745
    }

    .container-fluid {
        background: #fff;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center
    }

    .container-fluid .loader {
        width: 250px;
        height: 50px;
        line-height: 50px;
        text-align: center;
        position: absolute;
        top: 50%;
        left: 50%;
        -webkit-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
        font-family: "Helvetica Neue", Helvetica, Arial, "Microsoft Yahei", "Hiragino Sans GB", "Heiti SC", "WenQuanYi Micro Hei", sans-serif;
        text-transform: uppercase;
        font-weight: 900;
        color: #00bcd4;
        letter-spacing: .2em
    }

    .container-fluid .loader::after, .container-fluid .loader::before {
        content: "";
        display: block;
        width: 15px;
        height: 15px;
        background: #00bcd4;
        position: absolute;
        -webkit-animation: .7s ease-in-out infinite alternate load;
        animation: .7s ease-in-out infinite alternate load
    }

    .container-fluid .loader::before {
        top: 0
    }

    .container-fluid .loader::after {
        bottom: 0
    }

    @-webkit-keyframes load {
        0% {
            left: 0;
            height: 30px;
            width: 15px
        }
        50% {
            height: 8px;
            width: 40px
        }
        100% {
            left: 235px;
            height: 30px;
            width: 15px
        }
    }

    @keyframes load {
        0% {
            left: 0;
            height: 30px;
            width: 15px
        }
        50% {
            height: 8px;
            width: 40px
        }
        100% {
            left: 235px;
            height: 30px;
            width: 15px
        }
    }

    .hide {
        visibility: hidden
    }

    .show {
        visibility: visible
    }
</style>
