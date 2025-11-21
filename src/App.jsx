import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { ChevronDown, AlertCircle, Activity, Heart, Droplet, Frown, Smile, Thermometer, ArrowRight, Share2, Download, CheckCircle, Zap, Sun, Sparkles, Wind, Play, Pause, Volume2, VolumeX, Shield, X, Info, GripVertical, Plus, Settings, Image as ImageIcon, Upload, ChevronLeft, Menu, List, Star, Flame, Hammer, HardHat, Stethoscope, BookOpen, Eye, Grid, Layers, SplitSquareHorizontal, Package, Trash2, ChevronRight, Microscope, FileText, Quote, ShieldCheck, ShieldAlert, ZoomIn } from 'lucide-react';

// -----------------------------------------------------------------------------
// 1. 样式注入
// -----------------------------------------------------------------------------
const injectStyles = () => {
  const styleId = 'apple-style-scroll-css';
  if (document.getElementById(styleId)) return;

  const styleTag = document.createElement('style');
  styleTag.id = styleId;
  styleTag.innerHTML = `
    /* 基础动画 */
    @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-10px); } 100% { transform: translateY(0px); } }
    @keyframes float-slow { 0% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-15px) rotate(2deg); } 100% { transform: translateY(0px) rotate(0deg); } }
    @keyframes float-reverse { 0% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(10px) rotate(-2deg); } 100% { transform: translateY(0px) rotate(0deg); } }
    @keyframes blob { 0% { transform: translate(0px, 0px) scale(1); } 33% { transform: translate(30px, -50px) scale(1.1); } 66% { transform: translate(-20px, 20px) scale(0.9); } 100% { transform: translate(0px, 0px) scale(1); } }
    @keyframes twinkle { 0%, 100% { opacity: 0.2; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.2); filter: drop-shadow(0 0 4px rgba(255,255,255,0.8)); } }
    @keyframes modal-in { 0% { opacity: 0; transform: scale(0.95) translateY(20px); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
    @keyframes text-reveal { 0% { opacity: 0; transform: translateY(10px); } 100% { opacity: 1; transform: translateY(0); } }
    @keyframes slide-in-right { 0% { transform: translateX(100%); } 100% { transform: translateX(0); } }
    @keyframes pulse-ring { 0% { transform: scale(0.8); opacity: 0.5; } 100% { transform: scale(1.3); opacity: 0; } }
    @keyframes gradient-flow { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }

    /* 物理演示动画 */
    @keyframes brick-damaged { 0%, 100% { transform: scale(0.9) rotate(1deg); background-color: #fed7aa; border-color: #fb923c; } 50% { transform: scale(0.9) rotate(-1deg); } }
    @keyframes brick-healthy { 0%, 100% { transform: scale(1); background-color: #dbeafe; border-color: #60a5fa; } }
    @keyframes nerve-alarm { 0%, 100% { stroke: #ef4444; stroke-width: 3; filter: drop-shadow(0 0 5px red); } 50% { stroke: #fca5a5; } }
    @keyframes nerve-calm { 0%, 100% { stroke: #94a3b8; stroke-width: 2; filter: none; } }
    @keyframes attack-bounce { 0% { transform: translateY(-20px); opacity: 0; } 50% { transform: translateY(0); opacity: 1; } 60% { transform: translateY(-5px); } 100% { transform: translateY(-30px); opacity: 0; } }
    @keyframes attack-penetrate { 0% { transform: translateY(-20px); opacity: 0; } 20% { opacity: 1; } 100% { transform: translateY(180px); opacity: 0; } }
    @keyframes water-lock { 0%, 100% { transform: translateY(0); opacity: 0.8; } 50% { transform: translateY(-5px); opacity: 1; } }
    @keyframes water-evaporate { 0% { transform: translateY(0); opacity: 1; } 100% { transform: translateY(-200px); opacity: 0; } }

    .anim-brick-damaged { animation: brick-damaged 3s infinite ease-in-out; }
    .anim-brick-healthy { animation: brick-healthy 3s infinite ease-in-out; }
    .anim-nerve-alarm { animation: nerve-alarm 0.5s infinite alternate; }
    .anim-nerve-calm { animation: nerve-calm 3s infinite ease-in-out; }
    .anim-attack-bounce { animation: attack-bounce 2s linear forwards; }
    .anim-attack-penetrate { animation: attack-penetrate 1.5s linear forwards; }
    .anim-water-lock { animation: water-lock 3s infinite ease-in-out; }
    .anim-water-evaporate { animation: water-evaporate 1.5s linear forwards; }

    /* 通感交互特效 */
    @keyframes heat-wave { 0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); } 70% { box-shadow: 0 0 0 20px rgba(239, 68, 68, 0); } 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); } }
    @keyframes electric-shock { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-4px) rotate(-2deg); } 75% { transform: translateX(4px) rotate(2deg); } }
    @keyframes tight-squeeze { 0% { transform: scale(1); } 50% { transform: scale(0.92); border-width: 4px; } 100% { transform: scale(1); } }
    @keyframes happy-bounce { 0%, 100% { transform: translateY(0); } 40% { transform: translateY(-15px) scale(1.05); } 60% { transform: translateY(5px) scale(0.95); } 80% { transform: translateY(-5px); } }

    .effect-heat { animation: heat-wave 1.5s infinite; }
    .effect-shock { animation: electric-shock 0.3s ease-in-out; }
    .effect-tight { animation: tight-squeeze 0.4s ease-in-out forwards; }
    .effect-bounce { animation: happy-bounce 0.6s ease-in-out; }

    .animate-float { animation: float 6s ease-in-out infinite; }
    .animate-float-slow { animation: float-slow 8s ease-in-out infinite; }
    .animate-float-reverse { animation: float-reverse 9s ease-in-out infinite; }
    .animate-blob { animation: blob 10s infinite ease-in-out; }
    .animate-twinkle { animation: twinkle 3s ease-in-out infinite; }
    .animate-modal-in { animation: modal-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .animate-gradient-flow { animation: gradient-flow 3s ease infinite; background-size: 200% 200%; }
    
    .glass-card {
      background: rgba(255, 255, 255, 0.65);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.8);
      box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.05);
    }
    
    .diamond-facet {
      background: linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.8) 100%);
      border: 1px solid rgba(255,255,255,0.6);
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
      backdrop-filter: blur(5px);
    }
    
    .custom-scrollbar::-webkit-scrollbar { width: 8px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(0,0,0,0.1); border-radius: 20px; border: 2px solid white; }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: rgba(0,0,0,0.2); }

    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  `;
  document.head.appendChild(styleTag);
};

// -----------------------------------------------------------------------------
// 2. 数据结构：百科全书级知识库
// -----------------------------------------------------------------------------
const contentData = [
  {
    id: 'cover',
    type: 'hero',
    chapter: 'SKIN BARRIER RESCUE',
    title: '拒绝“红脸蛋”\n重获原生美肌', 
    subtitle: '泛红 · 干痒 · 刺痛？\n您的皮肤不是“坏”了，只是屏障“累”了。\n让我们一起，为它重建防御墙。',
    author: '开启修护之旅', 
  },
  {
    id: 'poll',
    type: 'poll',
    chapter: 'SELF CHECK',
    title: '此时此刻，\n您的皮肤感觉如何？',
    subtitle: '请凭直觉选择一项，听听皮肤的心声',
    highlightTip: '专家权威解读',
    detail: {
      title: '感觉是诊断的金标准：症状背后的生理机制',
      subtitle: 'Pathophysiology of Sensory Symptoms',
      intro: '根据国际瘙痒研究论坛 (IFSI) 定义，敏感肌的核心特征就是“对常规刺激产生不愉快的感觉”。这些主观感觉并非心理作用，而是皮肤微观结构受损的直接报警信号。',
      sections: [
        { 
          icon: <Thermometer size={28} className="text-red-500" />, 
          head: '发热/烫 (Burning) —— 血管调节功能障碍', 
          content: '这是“神经源性炎症”的典型表现。当皮肤受到刺激，神经末梢释放神经肽（如P物质），导致毛细血管瞬间扩张。',
          bullets: [
            '机制：毛细血管扩张充血，血液流速加快带来核心体温的热量。',
            '后果：长期反复的血管扩张会导致血管壁失去弹性，最终形成肉眼可见的永久性红血丝（毛细血管扩张症）。',
            '话术：“亲爱的，这是您的血管有点‘情绪化’了，就像弹簧失去了弹性，需要先帮它‘降温’和‘镇静’。”'
          ]
        },
        { 
          icon: <Zap size={28} className="text-amber-500" />, 
          head: '刺痛/痒 (Stinging) —— 感觉神经高反应性', 
          content: '这并非过敏，而是神经末梢的“阈值降低”。敏感肌患者表皮内的C类神经纤维密度往往异常增加。',
          bullets: [
            '机制：TRPV1通道（辣椒素受体）过度活跃，将微小的温度或化学刺激放大为痛觉信号传导给大脑。',
            '比喻：就像一根裸露的电线，失去了绝缘层（角质层）的保护，稍微一点风吹草动就会“漏电”。',
            '话术：“这不是过敏，而是您的皮肤‘防御系统’太累了，把普通的水乳当成了敌人，我们在修护时要先给神经穿上‘防弹衣’。”'
          ]
        },
        { 
          icon: <Droplet size={28} className="text-blue-500" />, 
          head: '紧绷/干 (Tightness) —— 屏障功能受损', 
          content: '这是经皮水分流失 (TEWL) 显著增加的物理表现。',
          bullets: [
            '机制：角质层含水量下降 (<10%) 时，角质细胞会发生物理性收缩，导致皮肤表面产生拉扯感。',
            '根源：细胞间脂质（神经酰胺、脂肪酸、胆固醇）流失，无法锁住内部水分。',
            '话术：“这种紧绷感是皮肤在喊‘渴’，但光喝水没用，因为杯子底（屏障）漏了。我们得先补油（脂质），把底补上。”'
          ]
        }
      ]
    },
    options: [
      { icon: <Thermometer />, label: '发热 / 烫', feedback: '这是【血管扩张】在求救！', activeColor: 'bg-red-500 border-red-500 text-white', activeEffect: 'effect-heat' },
      { icon: <Zap />, label: '刺痛 / 痒', feedback: '这是【神经末梢】裸奔的信号！', activeColor: 'bg-amber-500 border-amber-500 text-white', activeEffect: 'effect-shock' },
      { icon: <Droplet />, label: '紧绷 / 干', feedback: '这是【锁水膜】破损的表现！', activeColor: 'bg-blue-600 border-blue-600 text-white', activeEffect: 'effect-tight' },
      { icon: <Smile />, label: '还不错', feedback: '太棒了！我们要学会【未雨绸缪】。', activeColor: 'bg-emerald-500 border-emerald-500 text-white', activeEffect: 'effect-bounce' },
    ]
  },
  {
    id: 'diagnosis',
    type: 'diagnosis',
    chapter: 'THREE PROFILES',
    title: '您属于哪种\n“受损画像”？',
    subtitle: '90% 的敏感肌都逃不出这三种形态',
    highlightTip: 'Baumann 皮肤分型依据',
    detail: {
      title: '精准分型：Baumann 皮肤分型体系',
      subtitle: 'Personalized Diagnosis',
      intro: '根据 Leslie Baumann 教授的权威理论，敏感性皮肤并非单一类型。',
      sections: [
        { icon: <Wind size={28} className="text-blue-500" />, head: 'I型：角质层薄弱型', content: '对应 Baumann S2 型。', bullets: ['遗传性皮肤薄，表皮更替时间短。', '重点：增厚角质，物理防护。'] },
        { icon: <Flame size={28} className="text-red-500" />, head: 'II型：血管扩张型', content: '对应 Baumann S3 型。', bullets: ['血管神经功能紊乱，持续泛红。', '重点：抗炎镇静，收缩血管。'] },
        { icon: <Droplet size={28} className="text-orange-500" />, head: 'III型：屏障受损型', content: '人为破坏型。', bullets: ['过度清洁/刷酸导致皮脂膜破坏。', '重点：补充脂质，修复皮脂膜。'] }
      ]
    },
    profiles: [
      { title: '脆皮薄纸型', tag: '先天/老化', desc: '皮薄如纸，红血丝可见，遇冷热就红，但这红消得快。', icon: <Wind className="text-blue-500" />, color: 'bg-blue-50 border-blue-100' },
      { title: '火山爆发型', tag: '炎症/玫瑰痤疮', desc: '持续泛红，又油又干，起疹子，感觉脸在燃烧，不敢洗脸。', icon: <Flame className="text-red-500" />, color: 'bg-red-50 border-red-100' },
      { title: '城墙坍塌型', tag: '后天/激素/刷酸', desc: '曾经皮肤很好，但乱用产品后崩了，外油内干，粗糙起皮。', icon: <Frown className="text-orange-500" />, color: 'bg-orange-50 border-orange-100' }
    ]
  },
  {
    id: 'intro',
    type: 'text-image',
    chapter: 'THE CORE KNOWLEDGE',
    title: '重新定义敏感肌',
    desc: '它不是一种病，而是一种“高反应状态”。了解它，才能治愈它。',
    highlight: '“就像一个脾气很差的公主，稍有风吹草动就发脾气。”',
    highlightTip: '医学定义详解',
    detail: {
      title: '敏感性皮肤的医学定义',
      subtitle: 'Medical Definition',
      intro: '敏感性皮肤 (Sensitive Skin) 是一种特指皮肤在生理或病理条件下发生的一种高反应状态。它不是一种独立的疾病，而是一种综合征。',
      sections: [
        { icon: <Activity size={24} className="text-purple-500" />, head: '核心特征：高反应性', content: '正常皮肤能耐受的刺激，敏感肌却会出现不适感。这是一种“过度防御”机制。', quote: '“它不是免疫系统的变态反应（过敏），而是神经-血管-免疫网络的综合失调。”' },
        { icon: <Microscope size={24} className="text-blue-500" />, head: '三大发病机制', bullets: ['皮肤屏障受损：城墙破了。', '神经感觉异常：报警系统失灵。', '血管反应性增高：血管扩张。'] },
        { icon: <BookOpen size={24} className="text-gray-500" />, head: '治疗核心逻辑', content: '必须遵循“三分治，七分养”的原则，重建皮肤的生理结构。' }
      ]
    },
    subModules: [
      {
        id: 'features',
        title: '四大核心特征',
        icon: <Grid size={24} className="text-purple-500" />,
        desc: '痛·痒·红·干，占两样即中招',
        type: 'bento',
        highlightTip: '医学诊断标准',
        detail: {
           title: '敏感肌的临床诊断标准',
           subtitle: 'Diagnostic Criteria',
           intro: '在临床上，我们通常通过主观症状和客观体征相结合的方式进行诊断。',
           sections: [
             { icon: <Zap size={24} className="text-amber-500" />, head: '1. 主观症状', bullets: ['灼热感 (Burning)', '刺痛感 (Stinging)', '瘙痒感 (Itching)', '紧绷感 (Tightness)'] },
             { icon: <Eye size={24} className="text-blue-500" />, head: '2. 客观体征', bullets: ['弥漫性红斑', '红血丝', '干燥脱屑', '角质层菲薄'] }
           ]
        },
        data: { cards: [{ title: '痛 Pain', icon: <Activity />, col: 'col-span-1' }, { title: '痒 Itch', icon: <Frown />, col: 'col-span-1' }, { title: '红 Redness', icon: <Thermometer />, col: 'col-span-1' }, { title: '干 Dryness', icon: <Droplet />, col: 'col-span-1' }] }
      },
      {
        id: 'compare',
        title: '敏感 vs 过敏',
        icon: <SplitSquareHorizontal size={24} className="text-blue-500" />,
        desc: '体质虚弱 vs 中毒反应',
        type: 'compare',
        highlightTip: '鉴别诊断',
        detail: {
          title: '敏感与过敏的鉴别诊断',
          subtitle: 'Differential Diagnosis',
          sections: [
            { icon: <Shield size={24} className="text-red-500" />, head: '过敏 (Allergy)', content: '变态反应。有明确过敏原，发作快，消退快，需抗组胺药。' },
            { icon: <Activity size={24} className="text-orange-500" />, head: '敏感 (Sensitivity)', content: '高反应状态。无特定抗原，长期反复，需修护屏障。' }
          ]
        },
        data: { left: { title: '敏感 Sensitive', desc: '像“体虚”', tags: ['反复发作', '屏障受损', '长期维养'] }, right: { title: '过敏 Allergy', desc: '像“中毒”', tags: ['来去匆匆', '全身反应', '抗敏治疗'] } }
      },
      {
        id: 'compare-dry',
        title: '干性 vs 敏感',
        icon: <Droplet size={24} className="text-cyan-500" />,
        desc: '单纯缺水 vs 屏障破防',
        type: 'compare',
        highlightTip: '症状鉴别',
        detail: {
          title: '干性皮肤与敏感性皮肤的区别',
          subtitle: 'Dry vs. Sensitive',
          sections: [
            { icon: <Droplet size={24} className="text-blue-500" />, head: '干性皮肤', bullets: ['屏障可能完整，补水后舒适缓解。'] },
            { icon: <AlertCircle size={24} className="text-red-500" />, head: '敏感性皮肤', bullets: ['屏障破损，“虚不受补”，补水反刺痛。'] }
          ]
        },
        data: { left: { title: '干性皮肤 Dry', desc: '像“干旱的土地”', tags: ['缺水缺油', '无明显红肿', '补水即缓解'] }, right: { title: '敏感皮肤 Sensitive', desc: '像“受损的城墙”', tags: ['屏障受损', '遇热泛红', '补水仍刺痛'] } }
      },
      {
        id: 'wall',
        title: '城墙理论解密',
        icon: <Layers size={24} className="text-orange-500" />,
        desc: '为什么皮肤会“漏水”？',
        type: 'visual-wall',
        highlightTip: 'Elias 砖墙学说详解',
        detail: {
           title: '皮肤屏障的“砖墙结构”模型',
           subtitle: 'The Brick and Mortar Model',
           sections: [
             { icon: <HardHat size={28} className="text-orange-500" />, head: '砖块：角质细胞', content: '物理防线的硬骨头。' },
             { icon: <Grid size={28} className="text-yellow-500" />, head: '灰浆：细胞间脂质', content: '神经酰胺是核心。它粘合砖块，形成防水层。' },
             { icon: <AlertCircle size={28} className="text-red-500" />, head: '微观崩塌', content: '灰浆流失 -> 砖块松动 -> 外敌入侵/内水外流。' }
           ]
        },
        data: { title: '城墙是如何\n倒塌的？', subtitle: '健康的皮肤像一道墙。\n当“水泥”（脂质）流失，“砖块”松动，\n外界刺激就会直击神经。' }
      }
    ]
  },
  // --- 5. 解决方案中心 ---
  {
    id: 'ladder',
    type: 'ladder',
    chapter: 'SOLUTIONS HUB',
    title: '分阶梯 · 定制化\n修护方案',
    subtitle: '不乱治，不盲从。既然病因不同，方案自然不同。',
    highlightTip: '序贯疗法原则',
    detail: {
      title: '什么是“序贯疗法”？',
      subtitle: 'Sequential Therapy',
      intro: '序贯疗法是指在疾病的不同阶段，采用不同的治疗手段，循序渐进。',
      sections: [
        { icon: <Stethoscope size={28} className="text-red-500" />, head: '原则：急则治标，缓则治本', content: '炎症期禁忌高能量治疗。' },
        { icon: <Flame size={28} className="text-orange-500" />, head: '第一阶段：抗炎舒缓', bullets: ['目的：熄灭神经源性炎症。', '手段：冷疗、红黄光。'] },
        { icon: <Hammer size={28} className="text-blue-500" />, head: '第二阶段：屏障重建', bullets: ['目的：恢复砖墙结构。', '手段：中胚层补充营养。'] },
        { icon: <HardHat size={28} className="text-green-500" />, head: '第三阶段：强韧增厚', bullets: ['目的：增加真皮厚度。', '手段：光子、点阵激光。'] }
      ]
    },
    steps: [
      { phase: 'STAGE 01', name: '消防队模式', target: '针对：爆发期 (红/肿/烫)', action: '【灭火镇静】只做安抚，不破皮。', tools: ['黄光退红', '冷喷降温', '舒敏之星'], icon: <Flame size={40} className="text-white" />, bg: 'from-red-500 to-orange-500', shadow: 'shadow-red-200', detail: { title: '消防队模式详解', subtitle: 'Acute Inflammation Management', intro: '当务之急是“灭火”。此时皮肤处于高激惹状态，严禁任何破坏性治疗。', sections: [ { icon: <Flame size={24} className="text-red-500" />, head: '核心原理', content: '通过物理降温和光生物调节，阻断神经源性炎症通路，收缩毛细血管。' }, { icon: <Sun size={24} className="text-amber-500" />, head: '黄金手段：红黄光 (LED)', content: '黄光(590nm)促进细胞新陈代谢，红光(633nm)抗炎修复。' }, { icon: <Shield size={24} className="text-blue-500" />, head: '预期效果', bullets: ['即刻退红', '灼热感消失', '刺痛感缓解'] } ] } },
      { phase: 'STAGE 02', name: '泥瓦匠模式', target: '针对：稳定期 (干/痒/薄)', action: '【修补屏障】填补“水泥”，锁住水分。', tools: ['无针水光', '婴儿针', '外泌体'], icon: <Hammer size={40} className="text-white" />, bg: 'from-blue-500 to-cyan-500', shadow: 'shadow-blue-200', detail: { title: '泥瓦匠模式详解', subtitle: 'Barrier Reconstruction', intro: '火灭了，只剩断壁残垣。现在需要“水泥”（脂质与保湿因子）来填补砖墙缝隙。', sections: [ { icon: <Hammer size={24} className="text-blue-500" />, head: '核心原理', content: '砖墙结构重塑。通过中胚层疗法，突破角质层阻隔，直接投喂营养。' }, { icon: <Droplet size={24} className="text-cyan-500" />, head: '黄金手段：中胚层疗法', content: '无针水光或微针导入透明质酸、胶原蛋白、神经酰胺。' }, { icon: <Smile size={24} className="text-green-500" />, head: '预期效果', bullets: ['皮肤不再紧绷', '锁水能力恢复', '耐受力提升'] } ] } },
      { phase: 'STAGE 03', name: '加固队模式', target: '针对：巩固期 (易反复)', action: '【增厚地基】刺激真皮，让皮肤变厚实。', tools: ['非剥脱点阵', 'DPL光子', '中胚层'], icon: <HardHat size={40} className="text-white" />, bg: 'from-green-500 to-emerald-500', shadow: 'shadow-green-200', detail: { title: '加固队模式详解', subtitle: 'Dermal Thickening & Strengthening', intro: '不仅要修好，还要加厚。增加真皮厚度是防止敏感反复的根本。', sections: [ { icon: <HardHat size={24} className="text-green-500" />, head: '核心原理', content: '利用光热作用刺激成纤维细胞，促进胶原蛋白新生，增厚真皮层。' }, { icon: <Zap size={24} className="text-purple-500" />, head: '黄金手段：DPL/非剥脱点阵', content: 'DPL封闭多余血管改善红血丝；非剥脱点阵刺激胶原再生。' }, { icon: <ShieldCheck size={24} className="text-emerald-500" />, head: '预期效果', bullets: ['皮肤变厚实', '红血丝减少', '不再换季过敏'] } ] } }
    ],
    productsDetail: {
      title: '黄金搭档：光电与中胚层的作用机理',
      subtitle: 'Mechanism of Action',
      sections: [
        { icon: <Sun size={28} className="text-amber-500" />, head: '1. 光生物调节作用', bullets: ['非热效应，被线粒体吸收，上调ATP，加速修复。'] },
        { icon: <Droplet size={28} className="text-blue-500" />, head: '2. 中胚层疗法', bullets: ['突破吸收阻隔，精准投喂真皮层。'] },
        { icon: <Zap size={28} className="text-purple-500" />, head: '3. 选择性光热作用', bullets: ['DPL/光子吸收血红蛋白，封闭多余血管。'] }
      ]
    },
    products: [
      { name: '舒敏之星', tag: '温柔安抚', desc: '红黄光消炎' },
      { name: '无针水光', tag: '精准投喂', desc: '补充胶原蛋白' },
      { name: 'DPL/强脉冲', tag: '进阶去红', desc: '封闭多余血管' }
    ]
  },
  { id: 'cases', type: 'gallery', chapter: 'CASE STUDIES', title: '真实案例见证', subtitle: '拖动滑块查看改善效果', items: [] },
  { id: 'dialogue', type: 'dialogue', chapter: 'CHAPTER 05', title: '高情商沟通', bad: '❌ “你这脸怎么红成这样？好严重！”', good: '✅ “底子挺白嫩的，就是最近受累了，是不是很难受？”' },
  { id: 'cta', type: 'footer', title: '守护屏障', subtitle: '关注每一个“红脸蛋”', action: '开始行动' }
];

// -----------------------------------------------------------------------------
// 3. 核心通用组件
// -----------------------------------------------------------------------------
const StarDust = ({ count = 15, className="" }) => {
  const stars = useMemo(
    () =>
      [...Array(count)].map((_, i) => ({
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        size: Math.random() * 10 + 5,
        delay: Math.random() * 3,
        duration: Math.random() * 2 + 2,
      })),
    [count],
  );

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {stars.map((star, i) => (
        <div
          key={i}
          className="absolute animate-twinkle"
          style={{ top: star.top, left: star.left, animationDelay: `${star.delay}s`, animationDuration: `${star.duration}s` }}
        >
          <svg width={star.size} height={star.size} viewBox="0 0 24 24" fill="none">
            <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" fill="white" fillOpacity="0.8" />
          </svg>
        </div>
      ))}
    </div>
  );
};
const GlassCrystal = ({ size = 100, top, left, right, bottom, rotate = 0, delay = 0, type = "circle" }) => {
  const positionStyles = { top, left, right, bottom };
  Object.keys(positionStyles).forEach((key) => {
    if (positionStyles[key] === undefined) {
      delete positionStyles[key];
    }
  });

  return (
    <div
      className={`absolute pointer-events-none z-0 animate-float-slow diamond-facet`}
      style={{
        width: size,
        height: size,
        borderRadius: type === 'circle' ? '50%' : '20%',
        transform: `rotate(${rotate}deg)`,
        animationDelay: `${delay}s`,
        opacity: 0.6,
        ...positionStyles,
      }}
    >
      <div className="absolute inset-2 border border-white/50 rounded-[inherit] opacity-50"></div>
    </div>
  );
};
const Reveal = ({ children, className = "", delay = 0, priority = false }) => { const [isVisible, setIsVisible] = useState(priority); const ref = useRef(null); useEffect(() => { if (priority) return; const fallbackTimer = setTimeout(() => setIsVisible(true), 1000); const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setIsVisible(true); clearTimeout(fallbackTimer); observer.unobserve(entry.target); }}, { threshold: 0.05, rootMargin: "0px 0px -50px 0px" }); if (ref.current) observer.observe(ref.current); return () => { observer.disconnect(); clearTimeout(fallbackTimer); }; }, [priority]); if (priority) return <div className={className}>{children}</div>; return <div ref={ref} style={{ transitionDelay: `${delay * 100}ms` }} className={`transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] transform ${isVisible ? 'opacity-100 translate-y-0 scale-100 blur-0' : 'opacity-0 translate-y-12 scale-95 blur-sm'} ${className}`}>{children}</div>; };
const AmbientBg = ({ color = "blue" }) => {
  const palette = {
    blue: ['bg-blue-300/20', 'bg-purple-300/20', 'bg-pink-300/20'],
    pink: ['bg-pink-300/20', 'bg-rose-300/20', 'bg-amber-200/20'],
    gray: ['bg-gray-300/20', 'bg-slate-300/20', 'bg-zinc-300/20'],
  };
  const [primary, secondary, tertiary] = palette[color] || palette.blue;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className={`absolute -top-24 -left-24 w-96 h-96 ${primary} rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob`}></div>
      <div className={`absolute top-24 -right-24 w-96 h-96 ${secondary} rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000`}></div>
      <div className={`absolute -bottom-48 left-20 w-96 h-96 ${tertiary} rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000`}></div>
      <StarDust count={8} className="opacity-40" />
    </div>
  );
};
const Parallax = ({ children, speed = 0.1, className = "" }) => { const [offset, setOffset] = useState(0); const ref = useRef(null); useEffect(() => { const handleScroll = () => { if (!ref.current) return; const rect = ref.current.getBoundingClientRect(); if (rect.top < window.innerHeight && rect.bottom > 0) { setOffset((rect.top - window.innerHeight / 2) * speed); } }; window.addEventListener('scroll', handleScroll); return () => window.removeEventListener('scroll', handleScroll); }, [speed]); return <div ref={ref} style={{ transform: `translateY(${offset}px)` }} className={`will-change-transform ${className}`}>{children}</div>; };
const ExpertTipButton = ({ text, onClick, className = "" }) => ( <button onClick={(e) => { e.stopPropagation(); onClick(); }} className={`absolute top-6 right-6 md:top-10 md:right-10 flex items-center gap-2 text-blue-600 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full text-xs md:text-sm font-bold tracking-wide hover:bg-blue-50 hover:scale-105 transition-all shadow-sm z-20 border border-blue-100 ${className}`} > <Stethoscope size={16} /> <span className="hidden md:inline">{text}</span> <span className="md:hidden">解读</span> </button> );

// -----------------------------------------------------------------------------
// 4. 核心组件：皮肤微观演示 (SkinBarrierDemo)
// -----------------------------------------------------------------------------
const SkinBarrierDemo = () => {
  const [isDamaged, setIsDamaged] = useState(false);
  const [particles, setParticles] = useState([]);
  useEffect(() => {
    const interval = setInterval(() => {
      const id = Date.now();
      const type = Math.random() > 0.5 ? 'irritant' : 'moisture';
      const left = Math.random() * 100; 
      setParticles(prev => [...prev.slice(-20), { id, type, left }]);
    }, 400);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="w-full max-w-3xl mx-auto mt-8">
      <div className="flex justify-center gap-4 mb-8">
        <button onClick={() => setIsDamaged(false)} className={`px-6 py-3 rounded-full font-bold flex items-center gap-2 transition-all ${!isDamaged ? 'bg-blue-500 text-white shadow-lg scale-105' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}><ShieldCheck size={20} /> 健康屏障</button>
        <button onClick={() => setIsDamaged(true)} className={`px-6 py-3 rounded-full font-bold flex items-center gap-2 transition-all ${isDamaged ? 'bg-red-500 text-white shadow-lg scale-105' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}><ShieldAlert size={20} /> 受损屏障</button>
      </div>
      <div className="relative h-[300px] w-full bg-gradient-to-b from-sky-50 to-pink-50 rounded-[2rem] border-4 border-white shadow-inner overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-8 z-20 flex justify-center items-center text-[10px] text-gray-400 font-mono tracking-widest uppercase">External Environment</div>
        <div className="absolute top-8 left-0 w-full h-32 z-10 flex flex-col justify-center gap-1 px-4">
           {[...Array(3)].map((_, row) => (
             <div key={row} className="flex justify-between gap-1">
               {[...Array(8)].map((_, col) => (
                 <div key={col} className={`h-8 w-full rounded-md border-2 transition-all duration-1000 ${isDamaged ? 'anim-brick-damaged' : 'anim-brick-healthy'}`} style={{ backgroundColor: isDamaged ? '#fed7aa' : '#dbeafe', borderColor: isDamaged ? '#fb923c' : '#60a5fa', opacity: isDamaged ? 0.8 : 1 }}></div>
               ))}
             </div>
           ))}
           <div className={`absolute inset-0 bg-yellow-200/30 blur-md transition-opacity duration-1000 ${isDamaged ? 'opacity-0' : 'opacity-100'}`}></div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-32 bg-pink-100/50 z-0 flex items-end justify-center pb-4">
           <svg width="100%" height="60" viewBox="0 0 300 60" className="opacity-80">
             <path d="M0,50 Q50,20 100,50 T200,50 T300,50" fill="none" className={`transition-all duration-500 ${isDamaged ? 'anim-nerve-alarm' : 'anim-nerve-calm'}`} />
             <path d="M0,30 Q80,60 160,30 T320,30" fill="none" className={`transition-all duration-500 ${isDamaged ? 'anim-nerve-alarm' : 'anim-nerve-calm'}`} style={{animationDelay: '0.2s'}} />
           </svg>
           <span className={`absolute bottom-2 text-xs font-bold transition-colors ${isDamaged ? 'text-red-500 animate-pulse' : 'text-pink-300'}`}>{isDamaged ? '⚠️ NERVE ALERT' : 'Nerve Ending'}</span>
        </div>
        {particles.map(p => {
          let animationClass = '';
          if (p.type === 'irritant') { animationClass = !isDamaged ? 'anim-attack-bounce' : 'anim-attack-penetrate'; } else { animationClass = !isDamaged ? 'anim-water-lock' : 'anim-water-evaporate'; }
          return ( <div key={p.id} className={`absolute rounded-full shadow-sm ${p.type === 'irritant' ? 'w-2 h-2 bg-red-500' : 'w-1.5 h-1.5 bg-blue-400'} ${animationClass}`} style={{ left: `${p.left}%`, top: p.type === 'irritant' ? '10px' : 'auto', bottom: p.type === 'moisture' ? '40px' : 'auto' }}></div> );
        })}
      </div>
      <div className="mt-6 text-center text-gray-500 text-sm font-medium">
        {isDamaged ? <span className="text-red-500 flex items-center justify-center gap-2"><AlertCircle size={16}/> 屏障受损：水泥流失，刺激入内，水分蒸发</span> : <span className="text-blue-500 flex items-center justify-center gap-2"><ShieldCheck size={16}/> 屏障健康：外御刺激，内锁水分</span>}
      </div>
    </div>
  );
};

// -----------------------------------------------------------------------------
// 5. 知识模块弹窗渲染器
// -----------------------------------------------------------------------------
const KnowledgeRenderer = ({ module, onOpenExpertTip }) => {
  if (!module) return null;
  if (module.type === 'bento') { return ( <div className="space-y-6"> <p className="text-center text-gray-500 mb-8">{module.desc}</p> <div className="grid grid-cols-2 gap-4"> {module.data.cards.map((card, idx) => ( <div key={idx} className="p-6 bg-gray-50 rounded-3xl flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow"> <div className="mb-3 text-gray-400">{React.cloneElement(card.icon, { size: 32 })}</div> <h3 className="font-bold text-gray-900 text-lg">{card.title}</h3> </div> ))} </div> </div> ); }
  if (module.type === 'compare') { const { left, right } = module.data; const getIcons = (id) => { if (id === 'compare-dry') return { leftBig: <Sun size={80} />, rightBig: <AlertCircle size={80} /> }; return { leftBig: <Thermometer size={80} />, rightBig: <Zap size={80} /> }; }; const icons = getIcons(module.id); return ( <div className="space-y-6"> <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> <div className="p-6 bg-blue-50/50 rounded-[2rem] border border-blue-100 relative overflow-hidden"> <div className="absolute top-[-10%] right-[-10%] text-blue-200 opacity-20">{icons.leftBig}</div> <h3 className="text-xl font-bold text-blue-600 mb-2">{left.title}</h3> <p className="text-sm text-gray-600 mb-4 font-medium">{left.desc}</p> <div className="space-y-2"> {left.tags.map((t,i)=>(<div key={i} className="flex items-center gap-2 text-xs text-gray-500 bg-white/60 px-3 py-1.5 rounded-lg"><div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>{t}</div>))} </div> </div> <div className="p-6 bg-red-50/50 rounded-[2rem] border border-red-100 relative overflow-hidden"> <div className="absolute top-[-10%] right-[-10%] text-red-200 opacity-20">{icons.rightBig}</div> <h3 className="text-xl font-bold text-red-500 mb-2">{right.title}</h3> <p className="text-sm text-gray-600 mb-4 font-medium">{right.desc}</p> <div className="space-y-2"> {right.tags.map((t,i)=>(<div key={i} className="flex items-center gap-2 text-xs text-gray-500 bg-white/60 px-3 py-1.5 rounded-lg"><div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>{t}</div>))} </div> </div> </div> </div> ); }
  if (module.type === 'visual-wall') { return ( <div className="space-y-6 text-center"> <SkinBarrierDemo /> <div> <h3 className="text-2xl font-bold text-gray-900 mb-3 whitespace-pre-wrap">{module.data.title}</h3> <p className="text-gray-500 whitespace-pre-wrap leading-relaxed">{module.data.subtitle}</p> </div> </div> ); }
  if (module.type === 'showcase') { return ( <div className="space-y-4"> <p className="text-center text-gray-500 mb-6">推荐的治疗与修护产品</p> {module.data.products.map((prod, idx) => ( <div key={idx} className="p-4 bg-gray-50 rounded-2xl flex items-center gap-4"> <div className="p-3 bg-white rounded-xl shadow-sm text-blue-500"> {idx === 0 ? <Sun size={24} /> : idx === 1 ? <Droplet size={24} /> : <Zap size={24} />} </div> <div> <h4 className="font-bold text-gray-900">{prod.name}</h4> <p className="text-sm text-gray-500">{prod.desc}</p> </div> </div> ))} </div> ) }
  return <div>Unknown Module Type</div>;
};

// -----------------------------------------------------------------------------
// 6. 全能模态框 (Universal Modal)
// -----------------------------------------------------------------------------
const UniversalModal = ({ isOpen, onClose, content, isModule }) => {
  const [showExpertTip, setShowExpertTip] = useState(false);
  useEffect(() => { if (!isOpen) setShowExpertTip(false); }, [isOpen]);
  if (!isOpen || !content) return null;
  
  const handleExpertClick = () => setShowExpertTip(!showExpertTip);
  const hasExpertDetail = isModule && content.detail;
  const textContent = isModule ? content.detail : content;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md transition-opacity duration-300" onClick={onClose}></div>
      <div className="bg-white w-full max-w-6xl rounded-[2.5rem] shadow-2xl overflow-hidden relative z-10 animate-modal-in flex flex-col h-[90vh]">
        <div className="bg-gray-50 p-6 md:p-8 border-b border-gray-100 flex justify-between items-center shrink-0 sticky top-0 z-20">
          <div>
             {isModule && !showExpertTip ? (
                <>
                  <div className="flex items-center gap-2 text-blue-500 text-xs font-bold tracking-widest uppercase mb-1">
                    {content.icon && React.cloneElement(content.icon, { size: 14 })} KNOWLEDGE HUB
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">{content.title}</h2>
                </>
             ) : (
                <>
                  <div className="flex items-center gap-2 text-amber-500 text-xs font-bold tracking-widest uppercase mb-1">
                     <BookOpen size={14} /> MEDICAL INSIGHTS
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">{textContent?.title || content.title}</h2>
                  <p className="text-sm text-gray-500 font-mono mt-1 opacity-80">{textContent?.subtitle || content.subtitle}</p>
                </>
             )}
          </div>
          <div className="flex items-center gap-4">
             {hasExpertDetail && (
               <button onClick={handleExpertClick} className={`px-5 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 transition-all ${showExpertTip ? 'bg-blue-600 text-white shadow-lg' : 'bg-white border border-blue-100 text-blue-600 hover:bg-blue-50'}`}>
                 {showExpertTip ? <Grid size={16} /> : <Stethoscope size={16} />}
                 {showExpertTip ? '返回图解' : '专家解读'}
               </button>
             )}
             <button onClick={onClose} className="w-12 h-12 rounded-full bg-white shadow-sm border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors"><X size={24} className="text-gray-500" /></button>
          </div>
        </div>
        <div className="p-8 md:p-12 overflow-y-auto custom-scrollbar bg-white flex-1">
          {isModule && !showExpertTip ? (
             <div className="max-w-4xl mx-auto"><KnowledgeRenderer module={content} /></div>
          ) : (
             <div className="max-w-5xl mx-auto space-y-12">
                {textContent?.intro && (<div className="text-xl text-gray-700 leading-relaxed font-serif border-l-4 border-blue-500 pl-6 py-2 bg-blue-50/30 rounded-r-xl">{textContent.intro}</div>)}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {(textContent?.sections || []).map((section, idx) => (
                    <div key={idx} className="group p-6 rounded-3xl bg-gray-50 border border-gray-100 hover:border-blue-100 hover:shadow-md transition-all h-full" style={{ animation: `text-reveal 0.5s ease-out forwards ${idx * 0.1}s`, opacity: 0 }}>
                      <div className="flex gap-5 mb-4">
                        <div className="w-14 h-14 rounded-2xl bg-white text-blue-600 flex items-center justify-center shrink-0 shadow-sm border border-gray-100">{section.icon}</div>
                        <div><h4 className="text-xl font-bold text-gray-900 mb-2">{section.head}</h4>{section.content && <p className="text-gray-600 leading-relaxed text-sm font-medium">{section.content}</p>}</div>
                      </div>
                      <div className="pl-1 md:pl-1">
                        {section.bullets && (<ul className="space-y-3 mb-5 bg-white p-5 rounded-2xl border border-gray-100/50 shadow-inner">{section.bullets.map((bullet, bIdx) => (<li key={bIdx} className="flex items-start gap-3 text-sm text-gray-600"><span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0"></span><span className="leading-relaxed">{bullet}</span></li>))}</ul>)}
                        {section.quote && <div className="bg-amber-50/80 p-4 rounded-xl border border-amber-100 text-amber-800 text-sm font-medium flex gap-3 italic"><Quote size={16} className="shrink-0 opacity-50" />{section.quote}</div>}
                        {section.source && <div className="text-xs text-gray-400 mt-4 flex items-center gap-1 pt-4 border-t border-gray-200"><BookOpen size={12} /> 来源: {section.source}</div>}
                      </div>
                    </div>
                  ))}
                </div>
             </div>
          )}
        </div>
        {(!isModule || showExpertTip) && (<div className="p-4 bg-gray-50 border-t border-gray-100 text-center text-xs text-gray-400 font-mono flex justify-center items-center gap-2 shrink-0"><Shield size={12} /> 内容基于《中国敏感性皮肤诊治专家共识》及最新临床指南整理</div>)}
      </div>
    </div>
  );
};

// -----------------------------------------------------------------------------
// 7. 业务组件 (Sections)
// -----------------------------------------------------------------------------

const HeroSection = ({ data }) => { const handleStart = () => { const nextSection = document.getElementById('poll'); if (nextSection) { nextSection.scrollIntoView({ behavior: 'smooth' }); } }; return ( <div className="min-h-screen flex flex-col justify-center items-center text-center px-6 relative overflow-hidden bg-white" id={data.id}> <AmbientBg color="blue" /> <GlassCrystal size={120} top="15%" left="10%" rotate={15} delay={0} type="square" /> <GlassCrystal size={80} top="20%" right="15%" rotate={-10} delay={1} type="circle" /> <GlassCrystal size={150} bottom="10%" left="5%" rotate={45} delay={2} type="square" /> <StarDust count={20} /> <div className="z-10 max-w-5xl relative"> <Reveal priority={true}> <p className="text-xs font-bold tracking-[0.2em] text-gray-500 mb-6 uppercase font-mono flex items-center justify-center gap-2"> <Sparkles size={12} className="text-amber-400 animate-pulse" />{data.chapter}<Sparkles size={12} className="text-amber-400 animate-pulse" /> </p> </Reveal> <Reveal priority={true}> <h1 className="text-6xl md:text-7xl lg:text-9xl font-black tracking-tight text-gray-900 mb-8 leading-tight whitespace-pre-wrap bg-clip-text text-transparent bg-gradient-to-b from-gray-900 to-gray-600 drop-shadow-sm">{data.title}</h1> </Reveal> <Reveal priority={true}> <p className="text-lg md:text-2xl font-normal text-gray-500 mb-12 tracking-wide leading-relaxed max-w-3xl mx-auto whitespace-pre-wrap">{data.subtitle}</p> </Reveal> <Reveal priority={true}> <button onClick={handleStart} className="relative inline-flex items-center gap-3 px-10 py-5 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 group overflow-hidden text-white animate-gradient-flow" style={{ backgroundImage: 'linear-gradient(270deg, #2563eb, #7c3aed, #db2777, #2563eb)' }}> <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-white/20 rounded-full animate-[pulse-ring_2s_infinite]"></span> <span className="font-bold text-lg tracking-wide relative z-10">{data.author}</span> <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform relative z-10" /> </button> </Reveal> </div> </div> ); };

const PollSection = ({ data, onOpenModal }) => {
  const [selected, setSelected] = useState(null);
  const [animKeys, setAnimKeys] = useState({});
  const handleClick = (idx) => { setSelected(idx); setAnimKeys(prev => ({ ...prev, [idx]: (prev[idx] || 0) + 1 })); };
  return ( <section className="py-40 px-6 md:px-24 bg-white relative overflow-hidden" id={data.id}> <div className="max-w-4xl mx-auto text-center relative z-10"> {data.detail && <ExpertTipButton text={data.highlightTip} onClick={() => onOpenModal(data.detail, false)} />} <Reveal> <span className="text-blue-500 font-bold text-sm tracking-widest uppercase mb-6 block">{data.chapter}</span> <h2 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 tracking-tight whitespace-pre-wrap">{data.title}</h2> <p className="text-xl text-gray-500 mb-16">{data.subtitle}</p> </Reveal> <div className="grid grid-cols-2 md:grid-cols-4 gap-4"> {data.options.map((opt, idx) => ( <Reveal key={idx} delay={idx}> <button key={`${idx}-${animKeys[idx] || 0}`} onClick={() => handleClick(idx)} className={`w-full aspect-square rounded-3xl p-6 flex flex-col items-center justify-center gap-4 transition-all duration-300 border-2 relative overflow-hidden group ${selected === idx ? `${opt.activeColor} scale-105 shadow-xl ${opt.activeEffect}` : 'bg-gray-50 border-transparent text-gray-500 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600'}`}> <div className={`p-3 rounded-full relative z-10 ${selected === idx ? 'bg-white/20' : 'bg-white shadow-sm'}`}>{React.cloneElement(opt.icon, { size: 28 })}</div> <span className="font-bold relative z-10">{opt.label}</span> {selected === idx && (<div className="absolute inset-0 bg-white/10 pointer-events-none" />)} </button> </Reveal> ))} </div> {selected !== null && ( <div className="mt-12 animate-modal-in"> <div className="glass-card inline-block px-8 py-6 rounded-2xl border-l-4 border-blue-500 text-left max-w-2xl"> <h4 className="text-blue-600 font-bold mb-1 flex items-center gap-2"><Stethoscope size={18} /> 专家解读</h4> <p className="text-xl font-medium text-gray-800">{data.options[selected].feedback}</p> </div> </div> )} </div> </section> );
};

const DiagnosisSection = ({ data, onOpenModal }) => {
  const cardStyles = [ { bg: "from-cyan-50/80 to-white/90", border: "border-cyan-100", iconBg: "bg-cyan-100 text-cyan-600", accent: "text-cyan-600", barColor: "bg-cyan-400" }, { bg: "from-rose-50/80 to-white/90", border: "border-rose-100", iconBg: "bg-rose-100 text-rose-600", accent: "text-rose-600", barColor: "bg-rose-400" }, { bg: "from-amber-50/80 to-white/90", border: "border-amber-100", iconBg: "bg-amber-100 text-amber-600", accent: "text-amber-600", barColor: "bg-amber-400" } ];
  
  // 核心修复点：封装卡片点击事件
  const openCardDetail = (index) => {
    const profile = data.profiles[index];
    const detailSection = data.detail.sections[index];
    
    // 构造一个完整的 Modal Content 对象
    const modalPayload = {
      title: `【${profile.title}】诊断依据`,
      subtitle: profile.tag,
      intro: profile.desc,
      sections: [detailSection], // 包装成数组，符合 UniversalModal 的 expectations
      source: data.detail.title,
    };

    onOpenModal(modalPayload, false); // isModule=false forces text rendering
  };
  
  return ( <section className="py-40 px-6 md:px-24 bg-[#f5f5f7] relative" id={data.id}> <AmbientBg color="pink" /> <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-30"> <div className="absolute top-1/4 left-[-10%] w-[40vw] h-[40vw] bg-purple-200/40 rounded-full blur-[120px]"></div> <div className="absolute bottom-1/4 right-[-10%] w-[40vw] h-[40vw] bg-blue-200/40 rounded-full blur-[120px]"></div> </div> <div className="max-w-7xl mx-auto relative z-10"> {data.detail && <ExpertTipButton text={data.highlightTip} onClick={() => onOpenModal(data.detail, false)} />} <Reveal className="text-center mb-24"> <span className="text-blue-500 font-bold text-sm tracking-widest uppercase mb-6 block">{data.chapter}</span> <h2 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 tracking-tighter whitespace-pre-wrap">{data.title}</h2> <p className="text-xl text-gray-500">{data.subtitle}</p> </Reveal> <div className="grid md:grid-cols-3 gap-8"> {data.profiles.map((profile, idx) => { const style = cardStyles[idx] || cardStyles[0]; return ( <Reveal key={idx} delay={idx} className="h-full"> <button onClick={() => openCardDetail(idx)} className={`h-full relative p-10 rounded-[2.5rem] bg-gradient-to-b ${style.bg} border ${style.border} shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group overflow-hidden backdrop-blur-xl text-left`}> <div className="absolute -right-6 -top-10 text-[12rem] font-black text-gray-900/5 pointer-events-none select-none font-mono leading-none transition-transform duration-700 group-hover:scale-110 group-hover:rotate-12">0{idx + 1}</div> <div className={`relative w-20 h-20 rounded-3xl ${style.iconBg} flex items-center justify-center mb-10 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}> <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent rounded-3xl"></div> <div className="relative z-10">{React.cloneElement(profile.icon, { size: 36, strokeWidth: 2 })}</div> </div> <div className="relative z-10"> <div className={`inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase mb-4 px-3 py-1 rounded-full bg-white/50 backdrop-blur-sm border border-white/20 ${style.accent}`}>{profile.tag}</div> <h3 className="text-3xl font-bold text-gray-900 mb-6 group-hover:text-black transition-colors">{profile.title}</h3> <p className="text-gray-500 leading-relaxed text-lg font-medium">{profile.desc}</p> </div> <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gray-100 overflow-hidden"> <div className={`w-full h-full ${style.barColor} transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out`}></div> </div> </button> </Reveal> ); })} </div> </div> </section> );
};

const TextImageSection = ({ data, onOpenModal }) => (
  <section className="py-40 px-6 md:px-24 bg-[#f5f5f7] relative overflow-hidden" id={data.id}>
    <div className="absolute inset-0 opacity-30"><AmbientBg color="pink" /></div>
    <StarDust count={10} className="z-0" />
    <div className="max-w-6xl mx-auto relative z-10">
      <Reveal><span className="text-orange-500 font-bold text-sm tracking-widest uppercase mb-6 block">{data.chapter}</span></Reveal>
      <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
         <Reveal delay={2}>
            <h2 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 tracking-tighter">{data.title}</h2>
            <p className="text-2xl text-gray-500 font-medium leading-snug">{data.desc}</p>
         </Reveal>
         <Reveal delay={4}>
           <div onClick={() => data.detail && onOpenModal(data.detail, false)} className="glass-card p-12 rounded-[3rem] rotate-3 hover:rotate-0 transition-all duration-500 ease-out hover:scale-105 cursor-pointer group relative active:scale-95">
             {data.detail && <ExpertTipButton text={data.highlightTip} onClick={() => onOpenModal(data.detail, false)} className="opacity-0 group-hover:opacity-100 transition-opacity" />}
             <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent rounded-[3rem] pointer-events-none"></div>
             <div className="absolute -top-6 -right-6 w-20 h-20 bg-red-100 rounded-full animate-float-slow -z-10 mix-blend-multiply blur-xl"></div>
             <Heart className="w-16 h-16 text-red-500 mb-6 fill-red-500 animate-pulse drop-shadow-lg" />
             <p className="text-3xl font-bold text-gray-900 leading-tight group-hover:text-red-600 transition-colors">{data.highlight}</p>
             <div className="mt-6 flex items-center gap-2 text-red-400 text-sm font-mono"><Activity size={16} /> High Reactivity Mode</div>
           </div>
         </Reveal>
      </div>
      {data.subModules && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {data.subModules.map((mod, idx) => (
            <Reveal key={idx} delay={5 + idx}>
              <button onClick={() => onOpenModal(mod, true)} className="w-full p-6 glass-card rounded-[2rem] flex flex-col items-center justify-center gap-3 text-center hover:bg-white hover:shadow-xl transition-all group h-full">
                <div className="p-3 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform text-gray-400 group-hover:text-blue-500">{mod.icon}</div>
                <div><h4 className="font-bold text-gray-900 text-lg">{mod.title}</h4><p className="text-xs text-gray-500 mt-1">{mod.desc}</p></div>
                <div className="mt-2 text-xs font-bold text-blue-400 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">查看详情 <ArrowRight size={12} /></div>
              </button>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  </section>
);

const LadderSection = ({ data, onOpenModal }) => (
  <section className="py-32 px-6 md:px-24 bg-white relative overflow-hidden" id={data.id}>
    <StarDust count={20} />
    <div className="max-w-7xl mx-auto relative z-10">
      {data.detail && <ExpertTipButton text={data.highlightTip} onClick={() => onOpenModal(data.detail, false)} />}
      <Reveal className="mb-16 text-center md:text-left">
        <span className="text-green-600 font-bold text-sm tracking-widest uppercase mb-6 block">{data.chapter}</span>
        <h2 className="text-5xl md:text-7xl font-bold text-gray-900 whitespace-pre-wrap tracking-tighter">{data.title}</h2>
        <p className="text-xl text-gray-500 mt-6">{data.subtitle}</p>
      </Reveal>

      <div className="flex flex-col md:grid md:grid-cols-3 gap-6 pb-12 md:pb-0 -mx-6 px-6 md:mx-0 md:px-0 no-scrollbar snap-x snap-mandatory overflow-x-auto md:overflow-visible">
        {data.steps.map((step, idx) => (
          <div key={idx} className="snap-center shrink-0 w-[85vw] md:w-auto h-full group">
            <Reveal delay={idx} className="h-full">
               <button 
                 onClick={() => onOpenModal(step.detail, false)} // Click card to open detailed text modal
                 className={`relative w-full h-full min-h-[450px] rounded-[2.5rem] overflow-hidden bg-gradient-to-br ${step.bg} shadow-xl ${step.shadow} text-white flex flex-col justify-between p-8 hover:scale-[1.02] transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl text-left`}
               >
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none translate-x-[-100%] group-hover:translate-x-[100%] transition-transform"></div>
                  <div className="absolute top-[-20%] right-[-20%] w-48 h-48 bg-white/20 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700"></div>
                  <StarDust count={5} />
                  
                  <div className="relative z-10">
                     <div className="flex justify-between items-start mb-6">
                        <span className="text-xs font-mono tracking-widest opacity-70 border border-white/30 px-2 py-1 rounded-full">{step.phase}</span>
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
                           {React.cloneElement(step.icon, { size: 24 })}
                        </div>
                     </div>
                     <h3 className="text-3xl font-bold mb-3 leading-tight">{step.name}</h3>
                     <div className="inline-flex items-center gap-2 bg-black/20 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs font-bold mb-4">
                       <Activity size={12} /> {step.target}
                     </div>
                  </div>

                  <div className="relative z-10">
                     <p className="text-lg font-medium mb-6 leading-relaxed opacity-90">{step.action}</p>
                     <div className="border-t border-white/20 pt-6">
                       <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-3 flex items-center justify-between">
                         <span>Core Tools</span>
                         <span className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">详情 <ArrowRight size={10}/></span>
                       </p>
                       <div className="flex flex-wrap gap-2">
                         {step.tools.map((t, i) => (
                           <span key={i} className="px-3 py-1.5 bg-white/20 backdrop-blur-sm border border-white/10 rounded-lg text-xs font-bold hover:bg-white/30 transition-colors">
                             {t}
                           </span>
                         ))}
                       </div>
                     </div>
                  </div>
               </button>
            </Reveal>
          </div>
        ))}
      </div>
      
      <div className="mt-24">
         <Reveal>
            <div className="flex items-center gap-4 mb-8">
               <div className="h-px flex-1 bg-gray-100"></div>
               <h3 className="text-2xl font-bold text-gray-400 uppercase tracking-widest">黄金搭档 Products</h3>
               <div className="h-px flex-1 bg-gray-100"></div>
            </div>
         </Reveal>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.products.map((prod, idx) => (
              <Reveal key={idx} delay={3 + idx}>
                 <button 
                   onClick={() => onOpenModal({
                      title: prod.name,
                      subtitle: prod.tag,
                      detail: data.productsDetail // Pass as detail object to use text renderer
                   }, false)} // isModule=false forces text rendering
                   className="glass-card p-6 rounded-[2rem] text-left hover:bg-white hover:shadow-xl transition-all group w-full"
                 >
                    <div className="flex justify-between items-start mb-4">
                       <div className="p-3 bg-blue-50 text-blue-500 rounded-2xl group-hover:scale-110 transition-transform">
                          {idx === 0 ? <Sun size={24} /> : idx === 1 ? <Droplet size={24} /> : <Zap size={24} />}
                       </div>
                       <ArrowRight size={16} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-1">{prod.name}</h4>
                    <span className="text-xs font-bold text-blue-500 bg-blue-50 px-2 py-1 rounded-md mb-2 inline-block">{prod.tag}</span>
                    <p className="text-sm text-gray-500">{prod.desc}</p>
                 </button>
              </Reveal>
            ))}
         </div>
      </div>
    </div>
  </section>
);

const DialogueSection = ({ data }) => ( <section className="py-40 px-6 md:px-24 bg-white relative overflow-hidden" id={data.id}> <div className="max-w-5xl mx-auto relative z-10"> <Reveal className="text-center mb-24"> <span className="text-green-600 font-bold text-sm tracking-widest uppercase mb-6 block">{data.chapter}</span> <h2 className="text-6xl font-bold text-gray-900 tracking-tighter">{data.title}</h2> </Reveal> <div className="space-y-12 text-2xl md:text-3xl font-medium"> <Reveal delay={2} className="flex justify-start"> <div className="bg-[#f5f5f7] text-gray-500 px-10 py-8 rounded-[2rem] rounded-tl-none max-w-[85%] shadow-sm transform origin-top-left hover:scale-[1.02] transition-transform duration-300"> {data.bad} </div> </Reveal> <Reveal delay={4} className="flex justify-end"> <div className="bg-[#0071e3] text-white px-10 py-8 rounded-[2rem] rounded-tr-none shadow-2xl shadow-blue-200 max-w-[85%] transform origin-top-right hover:scale-[1.02] transition-transform duration-300 relative"> <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-ping"></div> {data.good} </div> </Reveal> </div> </div> </section> );
const FooterSection = ({ data }) => ( <section className="py-48 px-6 bg-black text-white text-center relative overflow-hidden" id={data.id}> <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div> <AmbientBg color="gray" /> <StarDust count={40} /> <div className="relative z-10"> <Reveal> <h2 className="text-7xl md:text-[9rem] font-black tracking-tighter mb-12 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-600 animate-breathe">{data.title}</h2> <p className="text-3xl text-gray-400 mb-16 font-light tracking-wide">{data.subtitle}</p> <button className="bg-white text-black px-12 py-5 rounded-full text-2xl font-bold hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all duration-300 active:scale-95"> {data.action} </button> </Reveal> <div className="mt-32 text-gray-600 text-sm font-mono opacity-60"> Designed for Medical Aesthetics Training © 2025 </div> </div> </section> );
const BeforeAfterSlider = ({ before, after, alt }) => { const [sliderPosition, setSliderPosition] = useState(50); const [isDragging, setIsDragging] = useState(false); const containerRef = useRef(null); const handleMove = useCallback((event) => { if (!isDragging || !containerRef.current) return; const rect = containerRef.current.getBoundingClientRect(); const x = event.type.includes('mouse') ? event.clientX : event.touches[0].clientX; const position = ((x - rect.left) / rect.width) * 100; setSliderPosition(Math.min(Math.max(position, 0), 100)); }, [isDragging]); const start = () => setIsDragging(true); const end = () => setIsDragging(false); useEffect(() => { window.addEventListener('mousemove', handleMove); window.addEventListener('mouseup', end); window.addEventListener('touchmove', handleMove); window.addEventListener('touchend', end); return () => { window.removeEventListener('mousemove', handleMove); window.removeEventListener('mouseup', end); window.removeEventListener('touchmove', handleMove); window.removeEventListener('touchend', end); }; }, [handleMove]); return ( <div ref={containerRef} className="relative w-full h-full max-h-[70vh] overflow-hidden cursor-ew-resize select-none group shadow-2xl rounded-3xl border-4 border-white/50 bg-gray-100 flex items-center justify-center" onMouseDown={start} onTouchStart={start}> <div className="relative w-full h-full flex items-center justify-center"> <img src={after} alt={`After ${alt}`} className="max-w-full max-h-full object-contain pointer-events-none" /> <div className="absolute top-6 right-6 bg-black/50 backdrop-blur-sm text-white text-sm font-bold px-4 py-2 rounded-full z-10">AFTER</div> <div className="absolute inset-0 w-full h-full overflow-hidden border-r-2 border-white box-content bg-gray-100 flex items-center justify-center" style={{ width: `${sliderPosition}%` }}> <div className="w-[100vw] max-w-none h-full flex items-center justify-center" style={{ width: containerRef.current ? containerRef.current.offsetWidth : '100vw' }}> <img src={before} alt={`Before ${alt}`} className="max-w-full max-h-full object-contain pointer-events-none" /> </div> <div className="absolute top-6 left-6 bg-white/80 backdrop-blur-sm text-black text-sm font-bold px-4 py-2 rounded-full">BEFORE</div> </div> </div> <div className="absolute top-0 bottom-0 w-12 -ml-6 flex items-center justify-center z-20 pointer-events-none group-hover:scale-110 transition-transform" style={{ left: `${sliderPosition}%` }}> <div className="w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center text-gray-400 border border-gray-100"><GripVertical size={24} /></div> </div> </div> ); };
const UploadModal = ({ isOpen, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [tag, setTag] = useState('');
  const [desc, setDesc] = useState('');
  const [beforeFile, setBeforeFile] = useState(null);
  const [afterFile, setAfterFile] = useState(null);

  if (!isOpen) return null;

  const fileToDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!(title && beforeFile && afterFile)) {
      alert('请填写标题并上传两张图片');
      return;
    }

    try {
      const [beforeData, afterData] = await Promise.all([fileToDataUrl(beforeFile), fileToDataUrl(afterFile)]);
      const newItem = {
        id: Date.now(),
        title,
        tag: tag || '未分类案例',
        desc: desc || '效果显著',
        before: beforeData,
        after: afterData,
      };
      onSave(newItem);
      setTitle('');
      setTag('');
      setDesc('');
      setBeforeFile(null);
      setAfterFile(null);
      onClose();
    } catch (error) {
      console.error('Failed to read files', error);
      alert('读取图片失败，请重试');
    }
  };

  const FileInput = ({ label, file, setFile }) => {
    const [previewUrl, setPreviewUrl] = useState('');

    useEffect(() => {
      if (!file) {
        setPreviewUrl('');
        return;
      }
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }, [file]);

    return (
      <div className="flex flex-col gap-2">
        <span className="text-sm font-bold text-gray-700">{label}</span>
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 hover:border-blue-400 transition-all">
          {previewUrl ? (
            <div className="relative w-full h-full">
              <img src={previewUrl} className="w-full h-full object-cover rounded-lg opacity-80" alt="preview" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 text-white text-xs font-bold rounded-lg">点击更换</div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 mb-2 text-gray-400" />
              <p className="text-xs text-gray-500">点击选择图片</p>
            </div>
          )}
          <input type="file" accept="image/*" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        </label>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose}></div>
      <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl z-10 overflow-hidden animate-modal-in">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="text-xl font-bold text-gray-900">上传新案例</h3>
          <button onClick={onClose}>
            <X size={20} className="text-gray-500 hover:text-black" />
          </button>
        </div>
        <form className="p-6 space-y-4 max-h-[70vh] overflow-y-auto no-scrollbar" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm font-bold text-gray-700 block mb-1">案例标题</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例如：红血丝修复案例"
              className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-bold text-gray-700 block mb-1">标签</label>
              <input
                type="text"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="项目名称"
                className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-gray-700 block mb-1">描述</label>
              <input
                type="text"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="治疗周期"
                className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FileInput label="术前 (Before)" file={beforeFile} setFile={setBeforeFile} />
            <FileInput label="术后 (After)" file={afterFile} setFile={setAfterFile} />
          </div>
          <div className="pt-2">
            <button type="submit" className="w-full py-3 bg-black text-white rounded-xl font-bold hover:scale-[1.02] transition-transform shadow-lg">
              确认添加
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const CaseGallerySection = ({ data, onUploadClick, items, onDelete }) => { const displayItems = items || []; const [currentIndex, setCurrentIndex] = useState(0); const handleNext = () => setCurrentIndex((prev) => (prev + 1) % displayItems.length); const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + displayItems.length) % displayItems.length); const handleDeleteClick = () => { if (displayItems.length > 0 && confirm('确定要删除这个案例吗？')) { onDelete(displayItems[currentIndex].id); if (currentIndex >= displayItems.length - 1) { setCurrentIndex(Math.max(0, displayItems.length - 2)); } } }; if (displayItems.length === 0) { return ( <section className="py-32 px-6 md:px-24 bg-white relative" id={data.id}> <div className="max-w-7xl mx-auto"> <Reveal> <span className="text-purple-600 font-bold text-sm tracking-widest uppercase mb-4 block">{data.chapter}</span> <h2 className="text-5xl md:text-7xl font-bold text-gray-900 tracking-tighter mb-8">{data.title}</h2> </Reveal> <Reveal delay={2}> <button onClick={onUploadClick} className="w-full aspect-video rounded-[2.5rem] border-2 border-dashed border-gray-200 hover:border-purple-300 hover:bg-purple-50 flex flex-col items-center justify-center gap-6 text-gray-400 hover:text-purple-500 transition-all group"> <div className="w-24 h-24 rounded-full bg-gray-50 group-hover:bg-white flex items-center justify-center group-hover:shadow-xl transition-all"><Upload size={40} /></div> <div className="text-center"><span className="text-xl font-bold block text-gray-900 mb-2">还没有案例</span><span className="text-sm">点击这里上传您的第一个对比案例</span></div> </button> </Reveal> </div> </section> ); } const currentItem = displayItems[currentIndex]; return ( <section className="py-32 px-6 md:px-24 bg-white relative" id={data.id}> <div className="max-w-7xl mx-auto mb-12 flex justify-between items-end"> <Reveal> <span className="text-purple-600 font-bold text-sm tracking-widest uppercase mb-4 block">{data.chapter}</span> <h2 className="text-5xl md:text-7xl font-bold text-gray-900 tracking-tighter">{data.title}</h2> <p className="text-gray-500 mt-4 text-lg">{data.subtitle}</p> </Reveal> <Reveal delay={2}> <button onClick={onUploadClick} className="group flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-900 hover:text-white rounded-full transition-all duration-300 text-sm font-medium"> <Plus size={16} className="group-hover:rotate-90 transition-transform" /><span className="hidden md:inline">添加新案例</span><span className="md:hidden">添加</span> </button> </Reveal> </div> <div className="max-w-7xl mx-auto relative"> <Reveal delay={1}> <div className="relative w-full h-[60vh] md:h-[70vh] flex items-center justify-center bg-gray-50 rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden"> <BeforeAfterSlider before={currentItem.before} after={currentItem.after} alt={currentItem.title} /> <button onClick={handleDeleteClick} className="absolute top-6 left-6 w-10 h-10 bg-white/80 hover:bg-red-500 hover:text-white text-gray-400 rounded-full flex items-center justify-center backdrop-blur-sm transition-all z-30" title="删除案例"> <Trash2 size={18} /> </button> </div> </Reveal> <div className="mt-8 flex flex-col gap-8"> <div className="flex flex-col md:flex-row justify-between items-center gap-6"> <Reveal delay={2}> <div className="text-center md:text-left"> <div className="flex items-center justify-center md:justify-start gap-3 mb-2"> <span className="inline-block px-3 py-1 bg-purple-50 text-purple-600 text-xs font-bold rounded-full tracking-wide uppercase">{currentItem.tag}</span> <span className="text-gray-300 font-mono text-sm">{currentIndex + 1} / {displayItems.length}</span> </div> <h3 className="text-3xl font-bold text-gray-900 mb-1">{currentItem.title}</h3> <p className="text-gray-500 font-medium">{currentItem.desc}</p> </div> </Reveal> {displayItems.length > 1 && ( <Reveal delay={2}> <div className="flex gap-4"> <button onClick={handlePrev} className="w-14 h-14 rounded-full bg-gray-100 hover:bg-black hover:text-white flex items-center justify-center transition-colors"><ChevronLeft size={24} /></button> <button onClick={handleNext} className="w-14 h-14 rounded-full bg-black text-white hover:bg-gray-800 flex items-center justify-center transition-colors shadow-lg"><ArrowRight size={24} /></button> </div> </Reveal> )} </div> {displayItems.length > 1 && ( <Reveal delay={3}> <div className="flex gap-4 overflow-x-auto pb-4 pt-2 no-scrollbar snap-x"> {displayItems.map((item, idx) => ( <button key={item.id || idx} onClick={() => setCurrentIndex(idx)} className={`relative h-24 aspect-square md:aspect-video rounded-xl overflow-hidden flex-shrink-0 snap-start transition-all duration-300 border-2 ${currentIndex === idx ? 'border-purple-500 ring-2 ring-purple-100 scale-105' : 'border-transparent opacity-60 hover:opacity-100 hover:scale-105'}`} > <img src={item.after} className="w-full h-full object-cover" alt="thumb" /> </button> ))} </div> </Reveal> )} </div> </div> </section> ); };
const NavigationMenu = ({ isOpen, onClose, sections }) => { const handleNavClick = (id) => { const element = document.getElementById(id); if (element) { element.scrollIntoView({ behavior: 'smooth' }); onClose(); } }; return ( <> <div className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-[90] transition-opacity duration-500 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={onClose} ></div> <div className={`fixed top-0 right-0 h-full w-80 bg-white/90 backdrop-blur-xl z-[100] shadow-2xl transform transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}> <div className="p-8 flex justify-between items-center border-b border-gray-100/50"> <h3 className="font-bold text-gray-900 text-lg">目录导航</h3> <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={20} /></button> </div> <div className="flex-1 overflow-y-auto p-6 space-y-2"> {sections.map((section, idx) => ( <button key={idx} onClick={() => handleNavClick(section.id)} className="w-full text-left p-4 rounded-2xl hover:bg-gray-100/80 transition-all group flex items-center gap-4" > <span className="text-xs font-mono text-gray-400 group-hover:text-blue-500 w-6">{(idx + 1).toString().padStart(2, '0')}</span> <div className="flex-1"> <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1 group-hover:text-blue-500">{section.chapter || 'Section'}</span> <span className="text-gray-800 font-medium line-clamp-1 group-hover:text-black">{section.title}</span> </div> <ArrowRight size={14} className="text-gray-300 group-hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" /> </button> ))} </div> </div> </> ); };
const VideoSection = ({ data }) => { return null; };

// -----------------------------------------------------------------------------
// 主程序
// -----------------------------------------------------------------------------

export default function AppleStyleScroll() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [modalContent, setModalContent] = useState(null);
  // 区分普通 Modal 和 模块 Modal
  const [isModuleModal, setIsModuleModal] = useState(false);
  
  const initialCasesData = contentData.find(item => item.id === 'cases');
  const [caseItems, setCaseItems] = useState(initialCasesData ? initialCasesData.items : []);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleAddCase = (newCase) => {
    setCaseItems(prev => [...prev, newCase]);
  };

  // 新增：删除案例
  const handleDeleteCase = (id) => {
    setCaseItems(prev => prev.filter(item => item.id !== id));
  };
  
  const handleOpenModal = (content, isModule = false) => {
    setModalContent(content);
    setIsModuleModal(isModule);
  };
  
  const handleCloseModal = () => {
    setModalContent(null);
    setIsModuleModal(false);
  };

  useEffect(() => {
    injectStyles(); // 调用防抖样式注入
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = windowHeight > 0 ? totalScroll / windowHeight : 0;
      setScrollProgress(Math.min(Math.max(scroll, 0), 1));
    }
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="font-sans antialiased bg-white text-gray-900 selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      
      <UniversalModal isOpen={!!modalContent} onClose={handleCloseModal} content={modalContent} isModule={isModuleModal} />
      
      <UploadModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} onSave={handleAddCase} />
      <NavigationMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} sections={contentData} />

      <div className="fixed top-0 left-0 w-full h-14 bg-white/70 backdrop-blur-xl z-50 border-b border-gray-100/50 flex items-center justify-between px-6 transition-all">
        <div className="text-xs font-mono font-bold tracking-widest text-gray-900 flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          金华瑞丽医美·让天下女人更美丽
        </div>
        <div className="w-1/4 h-1 bg-gray-100 rounded-full overflow-hidden hidden md:block">
           <div className="h-full bg-black transition-all duration-200 ease-out" style={{ width: `${scrollProgress * 100}%` }}></div>
        </div>
        <div className="flex items-center gap-4">
           <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600" onClick={() => setIsMenuOpen(true)} title="目录"><List size={18} /></button>
          <button className="bg-black text-white text-xs px-4 py-1.5 rounded-full font-medium hover:bg-gray-800 transition-colors flex items-center gap-2 shadow-lg"><Download size={12} /><span>PDF</span></button>
        </div>
      </div>

      <main>
        {contentData.map((item) => {
          switch(item.type) {
            case 'hero': return <HeroSection key={item.id} data={item} />;
            case 'text-image': return <TextImageSection key={item.id} data={item} onOpenModal={handleOpenModal} />;
            case 'poll': return <PollSection key={item.id} data={item} onOpenModal={handleOpenModal} />;
            case 'diagnosis': return <DiagnosisSection key={item.id} data={item} onOpenModal={handleOpenModal} />;
            case 'ladder': return <LadderSection key={item.id} data={item} onOpenModal={handleOpenModal} />;
            // 将删除逻辑传递给 Gallery 组件
            case 'gallery': return <CaseGallerySection key={item.id} data={item} items={caseItems} onUploadClick={() => setIsUploadOpen(true)} onDelete={handleDeleteCase} />;
            case 'dialogue': return <DialogueSection key={item.id} data={item} />;
            case 'footer': return <FooterSection key={item.id} data={item} />;
            default: return null;
          }
        })}
      </main>
    </div>
  );
}