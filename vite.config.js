import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import vue from "@vitejs/plugin-vue2";
import vitePluginCompression from "vite-plugin-compression";

export default defineConfig({
    base: './',
    plugins: [
        vue(),
        // vitePluginCompression(), //将css js 使用gzip压缩
        laravel({
            input: [
                'resources/js/app.js',
                'resources/js/agent.js',
            ],
            // agent: [
            //     'resources/js/agent.js',
            // ],
            refresh: true,
        }),
    ],
    build: {
        chunkSizeWarningLimit: 500,
        emptyOutDir: true,
        // assetsDir: "assets", //指定静态资源存放路径
        cssCodeSplit: true, //启用/禁用css代码拆分，如果禁用，整个项目的的所有CSS将被提取到一个CSS文件中
        minify: 'terser', //混淆器，terser构建后文件体积更小
        rollupOptions: {
            output: {
                //最小化拆分包
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        return id.toString().split('node_modules/')[1].split('/')[0].toString();
                    }
                },
                // //用于命名代码拆分时创建的共享块的输出命名
                // entryFileNames: 'js/[name].[hash].js',
                // //用于输出静态资源的命名
                // assetFileNames: '[ext]/[name].[hash].[ext]',
                // //拆分JS到模块文件夹
                // chunkFileNames: (chunkInfo)=>{
                //     const facadeModeuleID = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/') : [];
                //     const fileName = facadeModeuleID[facadeModeuleID.length - 2] || '[name]';
                //     return `js/${fileName}/[name].[hash].js`
                // }
            },
        },
    },
});
