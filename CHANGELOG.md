# [1.0.0-alpha.18](https://github.com/momentum-design/momentum-widgets/compare/v1.0.0-alpha.17...v1.0.0-alpha.18) (2024-04-17)


### Bug Fixes

* **a11y:** Fixed a bug in which accessibiltity enabled mouse click color loss ([#67](https://github.com/momentum-design/momentum-widgets/issues/67)) ([ed05d45](https://github.com/momentum-design/momentum-widgets/commit/ed05d45ee432140f036a01e3465fb42dd8437b37))
* **core:** optimize font settings of charts ([#65](https://github.com/momentum-design/momentum-widgets/issues/65)) ([52c6824](https://github.com/momentum-design/momentum-widgets/commit/52c6824d49f90d4c81f1042aa8f3caf87064ffef))
* **core:** the color of options does not work ([#64](https://github.com/momentum-design/momentum-widgets/issues/64)) ([bd56283](https://github.com/momentum-design/momentum-widgets/commit/bd56283c2b04b6e12a05f90d5a3bb309adf7cce3))
* **tooltip:** fix tooltip position issue ([#66](https://github.com/momentum-design/momentum-widgets/issues/66)) ([53c73dd](https://github.com/momentum-design/momentum-widgets/commit/53c73ddfe77f0f2811c5f16d321df6e4ad556424))


### Features

* **a11y:** for all charts ([#54](https://github.com/momentum-design/momentum-widgets/issues/54)) ([848967a](https://github.com/momentum-design/momentum-widgets/commit/848967a6d12ae7074256c88179181522a6a908f1))
* **core:** support getting data from URL ([e292b50](https://github.com/momentum-design/momentum-widgets/commit/e292b503f053755de00c484db429f46e179e311b))
* **xy:** add lineWidth option to change line size ([#62](https://github.com/momentum-design/momentum-widgets/issues/62)) ([0851409](https://github.com/momentum-design/momentum-widgets/commit/0851409ccff1f1653ca7086b738a820fb37520f9))

# [1.0.0-alpha.17](https://github.com/momentum-design/momentum-widgets/compare/v1.0.0-alpha.16...v1.0.0-alpha.17) (2024-03-10)


### Bug Fixes

* **pie:** reset pie series border width to 1 ([#58](https://github.com/momentum-design/momentum-widgets/issues/58)) ([91c663d](https://github.com/momentum-design/momentum-widgets/commit/91c663d337b66e39624138bd28a12935814f808d))


### Features

* **pie:** interactions between slice and legend ([6a7b355](https://github.com/momentum-design/momentum-widgets/commit/6a7b3554e2e13db735c1dd51c1b5b814f70e4db1))
* **theme:** support multiple themes includes dark mode ([1cacea3](https://github.com/momentum-design/momentum-widgets/commit/1cacea32b2914602a838264119820497c5ce3603))
* **tooltip:** chart tooltip support label customization ([#56](https://github.com/momentum-design/momentum-widgets/issues/56)) ([9e57aa4](https://github.com/momentum-design/momentum-widgets/commit/9e57aa43e1fd88f0ec6ad5a3f0332b04662c188b))
* **tooltip:** tooltip implementation for charts ([64f7fb1](https://github.com/momentum-design/momentum-widgets/commit/64f7fb15f3a1dca746518f938180d55778b7a0d6))
* **xy:** add default value precision for ticks of valueAxis ([#47](https://github.com/momentum-design/momentum-widgets/issues/47)) ([9ea1144](https://github.com/momentum-design/momentum-widgets/commit/9ea1144de8134d9af2155d7eb83cae510379bea3))
* **xy:** add fade effect to custom label color under selectable mode ([#52](https://github.com/momentum-design/momentum-widgets/issues/52)) ([a0c925f](https://github.com/momentum-design/momentum-widgets/commit/a0c925f32184b83ef2aa478742b91b29433710ac))
* **xy:** calculate the number of ticks based on canvas height ([#48](https://github.com/momentum-design/momentum-widgets/issues/48)) ([ef7cda9](https://github.com/momentum-design/momentum-widgets/commit/ef7cda989ff45107975e7047b77f143467310584))
* **xy:** labels of category axis can be selected ([#46](https://github.com/momentum-design/momentum-widgets/issues/46)) ([40fc84e](https://github.com/momentum-design/momentum-widgets/commit/40fc84e11d33cd8471ff98e147c0bac12382f2c1))


### Reverts

* feat(word-cloud): new chart type support about wordCloud ([#55](https://github.com/momentum-design/momentum-widgets/issues/55)) ([3748d1c](https://github.com/momentum-design/momentum-widgets/commit/3748d1cf5f8537fc39bb3020f088a9636d7f5c29))

# [1.0.0-alpha.16](https://github.com/momentum-design/momentum-widgets/compare/v1.0.0-alpha.15...v1.0.0-alpha.16) (2024-01-22)


### Bug Fixes

* **xy:**  inconsistent icon size in legend after setting markerStyle ([#44](https://github.com/momentum-design/momentum-widgets/issues/44)) ([0cf4351](https://github.com/momentum-design/momentum-widgets/commit/0cf43516a6da29bbcc8d401ed665049423fc4609))


### Features

* **bar:** bar chart supports mouse scrolling ([#45](https://github.com/momentum-design/momentum-widgets/issues/45)) ([10d1e73](https://github.com/momentum-design/momentum-widgets/commit/10d1e73efcfe63b85c90379cd7e752ffab65956f))
* **legend:** support cancelling selection from outside events ([40367f9](https://github.com/momentum-design/momentum-widgets/commit/40367f9a26b2d51c27606e68ca1f8c9b611b631b))

# [1.0.0-alpha.15](https://github.com/momentum-design/momentum-widgets/compare/v1.0.0-alpha.14...v1.0.0-alpha.15) (2023-12-28)


### Bug Fixes

* **core:** chart cannot be destroyed when rerendered ([36569de](https://github.com/momentum-design/momentum-widgets/commit/36569de7556588afcef3386eb95f0efeb204633b))
* **core:** circular function calls that will lead to all charts not work ([d752efb](https://github.com/momentum-design/momentum-widgets/commit/d752efbaac2e709bf5e626f46be2b47aafd0d35b))
* **core:** export chart-related interfaces ([#39](https://github.com/momentum-design/momentum-widgets/issues/39)) ([6b74d13](https://github.com/momentum-design/momentum-widgets/commit/6b74d13e8450c9b489af566ef6aa5634ef02ad3b))
* **core:** fix no resize canvas when resize chart ([81dd263](https://github.com/momentum-design/momentum-widgets/commit/81dd263d42d686b0ee75ba67b4f177da27e2f4cf))
* **legend:** position is offset when the parent element has padding ([#42](https://github.com/momentum-design/momentum-widgets/issues/42)) ([bad47bc](https://github.com/momentum-design/momentum-widgets/commit/bad47bc765cb90a6329e61d9a7c72e3f672fcfe5))
* **pie:** pie and donut chart can not be resized ([#40](https://github.com/momentum-design/momentum-widgets/issues/40)) ([996e91c](https://github.com/momentum-design/momentum-widgets/commit/996e91c6d8e00470bb7bd95a55c72feb4a5d2d56))
* **pkg:** cannot find the types definition as a wrong path ([e0a9054](https://github.com/momentum-design/momentum-widgets/commit/e0a9054bf93b4f1d42ed703eec81ace0e4f05251))


### Features

* **xy:** supports dashed area style and label callback ([dcd1e21](https://github.com/momentum-design/momentum-widgets/commit/dcd1e21e43c8c5684bfbacd7b14e883a63a1c308))

# [1.0.0-alpha.14](https://github.com/momentum-design/momentum-widgets/compare/v1.0.0-alpha.13...v1.0.0-alpha.14) (2023-12-12)


### Bug Fixes

* **core:** lint error for some variables ([7397be9](https://github.com/momentum-design/momentum-widgets/commit/7397be94fd6cbc458fab642b385745eba60618d6))

# [1.0.0-alpha.13](https://github.com/momentum-design/momentum-widgets/compare/v1.0.0-alpha.12...v1.0.0-alpha.13) (2023-12-12)


### Bug Fixes

* **core:** the chart component does not work under angular routing ([7dabcdc](https://github.com/momentum-design/momentum-widgets/commit/7dabcdcb772e46d54d395e070011587982bc8428))
* **xy:** fix some issues for line, column, bar and mixed charts ([#34](https://github.com/momentum-design/momentum-widgets/issues/34)) ([157bf7f](https://github.com/momentum-design/momentum-widgets/commit/157bf7fa97625e748ca9c620ca97208ac1a3c5fa))


### Features

* **core:** number format and suffix for big number ([f3bb6c2](https://github.com/momentum-design/momentum-widgets/commit/f3bb6c2c300569e76282b6ff013d85e9f839c7fe))
* **legend:** click event for legend item ([949476c](https://github.com/momentum-design/momentum-widgets/commit/949476cddba5ec538d273d2c380d5a1158fb287a))
* **legend:** legend selectable and hidden styles ([#32](https://github.com/momentum-design/momentum-widgets/issues/32)) ([be3394f](https://github.com/momentum-design/momentum-widgets/commit/be3394f8798c7b976988c39291410f3ece34f0c2))
* **legend:** support customizing marker icon of legend item ([#31](https://github.com/momentum-design/momentum-widgets/issues/31)) ([cbb78b7](https://github.com/momentum-design/momentum-widgets/commit/cbb78b7b522199c728a9eeddaa3c0f76edfcdbdd))

# [1.0.0-alpha.12](https://github.com/momentum-design/momentum-widgets/compare/v1.0.0-alpha.11...v1.0.0-alpha.12) (2023-11-30)


### Bug Fixes

* **core:** chart options cannot be merged into this.options ([46e7177](https://github.com/momentum-design/momentum-widgets/commit/46e717725dfc45343dac444dad1be5401afc54bb))
* **gauge:** fix some bug for gauge chart ([#28](https://github.com/momentum-design/momentum-widgets/issues/28)) ([7022bc2](https://github.com/momentum-design/momentum-widgets/commit/7022bc2592220dff613a905b88830bf988516fe8))
* **pie:** Resolve pie chart dataKey issue ([#25](https://github.com/momentum-design/momentum-widgets/issues/25)) ([03e27fa](https://github.com/momentum-design/momentum-widgets/commit/03e27faed1bd238acf3626ceefa378087a392546))
* **word-cloud:** color does not work in tooltip sometimes ([d85413e](https://github.com/momentum-design/momentum-widgets/commit/d85413e27152efac7fb2be15cb5f3d9633189fa6))


### Features

* **core:** color system implementation ([b7ed061](https://github.com/momentum-design/momentum-widgets/commit/b7ed06112ede197e0e1bbc54489c40abdbf51f38))
* **core:** enable global font ([48ae14b](https://github.com/momentum-design/momentum-widgets/commit/48ae14ba2ba26c878b4b93465a554d033ee62085))
* **core:** events structure and wordClick for Word Cloud ([abe59d1](https://github.com/momentum-design/momentum-widgets/commit/abe59d199432f9a03bfa1a1d55847641ebd9204f))
* **core:** function to get value with unit ([7e306b4](https://github.com/momentum-design/momentum-widgets/commit/7e306b4e5c844e60eaa1786a683742ad4fbb8b71))
* **core:** remove some built-in themes ([2894dae](https://github.com/momentum-design/momentum-widgets/commit/2894daee323d7712bf3feb69007a6759433a450f))
* **core:** supplement colors for material theme ([443e0b6](https://github.com/momentum-design/momentum-widgets/commit/443e0b6ad6a86d5375175fece0fcb24b7d976b98))
* **donut:** support labels customization  ([#29](https://github.com/momentum-design/momentum-widgets/issues/29)) ([4504126](https://github.com/momentum-design/momentum-widgets/commit/450412646ad5416e5ea2f9a7cff90f28cfedf830))
* **gauge:** support array for scales ([#30](https://github.com/momentum-design/momentum-widgets/issues/30)) ([33bd437](https://github.com/momentum-design/momentum-widgets/commit/33bd4372431f8fa247058025998a05e976fd0c4b))
* **pie:** pie chart and donut chart ([#23](https://github.com/momentum-design/momentum-widgets/issues/23)) ([c1c722c](https://github.com/momentum-design/momentum-widgets/commit/c1c722c774d7d27726bc04c1d52ff891a4450037))
* **word-cloud:** font size settings and automatically compute font size ([017d804](https://github.com/momentum-design/momentum-widgets/commit/017d804d0aa60375802138b121c31dc49b28ea47))
* **word-cloud:** new chart type support about wordCloud ([c4a614e](https://github.com/momentum-design/momentum-widgets/commit/c4a614e12c42919b8f26cbab1d090f3cbf171ad3))
* **xy:** support multiple value axes for XYChart ([#20](https://github.com/momentum-design/momentum-widgets/issues/20)) ([6a6d1f4](https://github.com/momentum-design/momentum-widgets/commit/6a6d1f4ba9702b858449b0540b3723b79db78e48))

# [1.0.0-alpha.11](https://github.com/momentum-design/momentum-widgets/compare/v1.0.0-alpha.10...v1.0.0-alpha.11) (2023-10-30)


### Bug Fixes

* **xy:** the style is invalid when area and line charts are combined ([#12](https://github.com/momentum-design/momentum-widgets/issues/12)) ([ad37daf](https://github.com/momentum-design/momentum-widgets/commit/ad37dafe56f3806984dc376ab649e67075e3ebcf))

# [1.0.0-alpha.10](https://github.com/momentum-design/momentum-widgets/compare/v1.0.0-alpha.9...v1.0.0-alpha.10) (2023-10-25)


### Features

* **xy:** new charts about line, area, column and bar ([#9](https://github.com/momentum-design/momentum-widgets/issues/9)) ([80cddc9](https://github.com/momentum-design/momentum-widgets/commit/80cddc9ed4bbba76716f9b5a50ad1a0583783e91))

# [1.0.0-alpha.9](https://github.com/momentum-design/momentum-widgets/compare/v1.0.0-alpha.8...v1.0.0-alpha.9) (2023-10-24)


### Bug Fixes

* **core:** theme does not work after adding ([d2ccfbf](https://github.com/momentum-design/momentum-widgets/commit/d2ccfbf0efbddf7cce6fd3919080f49c79611208))

# [1.0.0-alpha.8](https://github.com/momentum-design/momentum-widgets/compare/v1.0.0-alpha.7...v1.0.0-alpha.8) (2023-09-19)


### Bug Fixes

* **pie:** support converting the entire chart to canvas ([#8](https://github.com/momentum-design/momentum-widgets/issues/8)) ([3cc28d7](https://github.com/momentum-design/momentum-widgets/commit/3cc28d7c77218dc70dd47e090948f913931ba0dc))

# [1.0.0-alpha.7](https://github.com/momentum-design/momentum-widgets/compare/v1.0.0-alpha.6...v1.0.0-alpha.7) (2023-08-16)


### Bug Fixes

* **tooltip:** adjust default tooptip templete ([#7](https://github.com/momentum-design/momentum-widgets/issues/7)) ([f367899](https://github.com/momentum-design/momentum-widgets/commit/f367899ddc63b6c3a63667f45ed9b331084f2670))

# [1.0.0-alpha.6](https://github.com/momentum-design/momentum-widgets/compare/v1.0.0-alpha.5...v1.0.0-alpha.6) (2023-08-14)


### Features

* **tooltip:** support customize chart tooltip and legend tooltip ([#6](https://github.com/momentum-design/momentum-widgets/issues/6)) ([fb64a39](https://github.com/momentum-design/momentum-widgets/commit/fb64a39bf0a837e82e26b31a355b7cf06693689c))

# [1.0.0-alpha.5](https://github.com/momentum-design/momentum-widgets/compare/v1.0.0-alpha.4...v1.0.0-alpha.5) (2023-08-07)


### Bug Fixes

* **pie:** code change for chart get global theme ([#5](https://github.com/momentum-design/momentum-widgets/issues/5)) ([dfed1ed](https://github.com/momentum-design/momentum-widgets/commit/dfed1ed1cf82a1e2fe79c2c41a56c775092a3d93))

# [1.0.0-alpha.4](https://github.com/momentum-design/momentum-widgets/compare/v1.0.0-alpha.3...v1.0.0-alpha.4) (2023-08-02)


### Features

* **pie:**  pie chart type and legend clickable ([#3](https://github.com/momentum-design/momentum-widgets/issues/3)) ([862414a](https://github.com/momentum-design/momentum-widgets/commit/862414ae79172421d7f52365f861e9159f74c1af))

# [1.0.0-alpha.3](https://github.com/momentum-design/momentum-widgets/compare/v1.0.0-alpha.2...v1.0.0-alpha.3) (2023-08-01)


### Bug Fixes

* **ci:** cannot get the latest code ([3ea3248](https://github.com/momentum-design/momentum-widgets/commit/3ea3248d75bb967b6454e2d0a631a6a0641e86e8))

# [1.0.0-alpha.2](https://github.com/momentum-design/momentum-widgets/compare/v1.0.0-alpha.1...v1.0.0-alpha.2) (2023-07-25)


### Features

* **a11y:** accessibility support for chart and chart legend ([#1](https://github.com/momentum-design/momentum-widgets/issues/1)) ([5070bf7](https://github.com/momentum-design/momentum-widgets/commit/5070bf7b3c71f5a956b3960030efc1177741cdd5))

# 1.0.0-alpha.1 (2023-07-24)


### Bug Fixes

* **style:** remove global body styles ([0ae888f](https://github.com/momentum-design/momentum-widgets/commit/0ae888fd1761b3c06409700960b9d8bc6e6c2242))


### Features

* **gauge:** new widget about guage chart ([#2](https://github.com/momentum-design/momentum-widgets/issues/2)) ([511352b](https://github.com/momentum-design/momentum-widgets/commit/511352b67c00b4f142b26d1a863c215eef34bc16))
* **pkg:** add chartjs package ([2055cbb](https://github.com/momentum-design/momentum-widgets/commit/2055cbbf82a200ed38fc3709bfeaabeecdbac2f0))
