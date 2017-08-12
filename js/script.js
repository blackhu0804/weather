$(function(){
      var dicW = ["Sunday","Monday","Tuesday","Wednesday","Thursady","Firday","Saturday"]

      function src(foo){
        return 'http://ou2esgjjd.bkt.clouddn.com/' + foo + '.png'
      }

      function countTime(){
        //设置时间
        var time = new Date()
        var arr = []
        if(time.getHours() >= 13){
          arr[0] = 'PM'
          arr[1] = time.getHours() - 12
        }else {
          arr[0] = 'AM'
          arr[1] = time.getHours()
        }

        var dicM = ["Jauary","February","March","April","May","June","August","September","October","November","December"]
        if(arr[1] < 10)
          arr[1] = '0' + arr[1]
        arr[2] = time.getMinutes() //分
        if(arr[2] < 10) 
          arr[2] = '0' + arr[2]
        
        arr[3] = time.getDate()   //日
        arr[4] = dicW[time.getDay()]  //星期
        arr[5] = dicM[time.getMonth()]  //月
        arr[6] = time.getFullYear() //年

        $('.time .hour').text(arr[1])
        $('.time .min').text(arr[2])
        $('.time .sub').text(arr[0])

        $('info').text(arr[6] + '年' + arr[5] + ' ' + arr[4] + ' ' + arr[3])
      }


      countTime()
      setInterval(countTime,60000)


      var nowCity;
      function run(e){
        $.get('https://free-api.heweather.com/v5/weather?lang=zh&city=' + e + '&key=afc36ffff1194d2da2ae7ad774b10812',function(e){
          var data = e.HeWeather5[0]
          
          $.ajax({url:'https://api.asilu.com/bg',dataType:'JSONP'}).done(function(e){
            var picNum = Math.round(7*(Math.random()))
            $('#weather').css('backgroundImage','url(' + e.images[picNum].url + ')' )
          })

          function setInfo($li,i){
            $li.find('img').attr('src',src(data.daily_forecast[i-1].cond.code_d))
            var weeks = new Date()
            weeks = dicW[(weeks.getDay() + i) % 7]
            $li.find('.week').text(weeks.toUpperCase())
            $li.find('.temp').text(data.daily_forecast[i-1].tmp.max + '°')
          }

          nowCity = data.basic.city[0].toUpperCase() + data.basic.city.slice(1,999)
          $('.city').val(nowCity)
          $('.today-weather img').attr('src',src(data.now.cond.code))
          $('.today-weather .temp').text(data.now.tmp + '°')


          for(var i = 1;i <= 3;i++){
            setInfo($('.footer ul li').eq(i),i)
          }

          $('.weather-text').text(data.now.cond.txt)
          
          //如果nodeValue的值为null,则对它赋值也不会有任何效果.
          $('.weather-basic p').eq(0).contents()[1].nodeValue = data.aqi.city.pm10
          $('.weather-basic p').eq(1).contents()[1].nodeValue = data.aqi.city.pm25
          $('.weather-basic p').eq(2).contents()[1].nodeValue = data.aqi.city.qlty
        })
      }


      $.get('https://weixin.jirengu.com/weather/ip',function(e){
        run(e.data)

        $('.city').change(function(e){
          $.get('https://api.heweather.com/v5/search?city=' + $(this).val() +'&key=afc36ffff1194d2da2ae7ad774b10812',function(e){
            if(e.HeWeather5[0].status != 'ok'){
              $('.cityError').slideDown(200).delay(1200).slideUp(200)
              $('.city').val(nowCity)
            }else{
              run(e.HeWeather5[0].basic.city)
              $('.city').val(nowCity)
            } 
          })
        })
      })
      
      function flash(){
        $('.point').delay(1000).fadeOut(1000).show(0)
      }
      setInterval(flash,1000)
    })