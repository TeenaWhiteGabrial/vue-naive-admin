<template>
  <n-card class="w-50%" title="📝 待办清单" segmented>
    <template #header-extra>
      <span class="font-bold opacity-90 text-highlight">🚧 努力施工中......</span>
    </template>

    <ul class="opacity-90">
      <li class="py-4">
        🆒 使用
        <b>Vue3</b>
        主流技术栈:
        <span class="text-highlight">Vite + Vue3 + Pinia</span>
      </li>
      <li class="py-4">
        🍇 使用
        <b>原子CSS</b>
        框架:
        <span class="text-highlight">Unocss</span>
        ，优雅、轻量、易用
      </li>
      <li class="py-4">
        🤹 使用主流的
        <span class="text-highlight">iconify + unocss</span>
        图标方案，支持自定义图标，支持动态渲染
      </li>
      <li class="py-4">
        🎨 使用 Naive UI，
        <span class="text-highlight">极致简洁的代码风格和清爽的页面设计</span>
        ，审美在线，主题轻松定制
      </li>
      <li class="py-4">
        👏 先进且易于理解的文件结构设计，多个模块之间
        <b>零耦合</b>
        ，单个业务模块删除不影响其他模块
      </li>
      <li class="py-4">
        🚀
        <span class="text-highlight">扁平化路由</span>
        设计，每一个组件都可以是一个页面，告别多级路由 KeepAlive 难实现问题
      </li>

      <li class="py-4">
        🍒
        <span class="text-highlight">基于权限动态生成路由</span>
        ，无需额外定义路由，
        <span class="text-highlight">403和404可区分</span>
        ，而不是无权限也跳404
      </li>
      <li class="py-4">
        🔐 基于Redis集成
        <span class="text-highlight">无感刷新</span>
        ，用户登录态可控，安全与体验缺一不可
      </li>
      <li class="py-4">
        ✨ 基于 Naive UI 封装
        <span class="text-highlight">message</span>
        全局工具方法，支持批量提醒，支持跨页面共享实例
      </li>
      <li class="py-4">
        ⚡️ 基于 Naive UI 封装常用的业务组件，包含
        <span class="text-highlight">Page</span>
        组件、
        <span class="text-highlight">CRUD</span>
        表格组件及
        <span class="text-highlight">Modal</span>
        组件，减少大量重复性工作
      </li>
    </ul>

    <n-divider class="mb-0! mt-12!">
      <p class="text-14 opacity-60">
        👉点击
        <b class="mx-2 transition hover:text-primary">
          <a href="https://isme.top" target="_blank">更多</a>
        </b>
        查看更多实用功能，持续开发中...
      </p>
    </n-divider>
  </n-card>
</template>
