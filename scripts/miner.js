$(function() {
  $('#threads').text(navigator.hardwareConcurrency);
  var threads = $('#threads').text();
  var miner;
  var username;
  var status;
  var statsLabels;
  var statsData;
  var doughtCanvas = $("#donut-canvas").toggle();
  var barChart, doughnutChart;
  var barChartCanvas = $("#barchart-canvas");
  var weeklyCanvas = $("#weekly-canvas").toggle();
  var siteKey = "<YOUR_SITE_PUBLIC_KEY>";
  var hashingChart;
  var miners;
  var charts = [barChartCanvas, doughtCanvas, weeklyCanvas];
  var selectedChart = 0;

  function htmlEncode(value) {
    return $('<div/>').text(value).html();
  }

  function shortenString(text) {
    if (text.length >= 30) {
      return text.substring(0, 30) + '...';
    } else {
      return text;
    }
  }

  function updateStats() {
    $.get("api/getTopMiners.php", function(response) {
      response = $.parseJSON(response);
      if (miners) {
        var minersOld = miners.splice(0);
      }
      miners = $.map(response, function(balance, username) {
        var json = {};
        json['username'] = username;
        json['total'] = balance;
        return json;
      });
      $("#toplist").find("tr").remove();
      for (var i = 0; i < miners.length; i++) {
        var username = miners[i]['username'];
        var balance = miners[i]['total'];

        $('#toplist').append("<tr><td class='rank'>" + htmlEncode((i + 1)) + ".</td><td>" + htmlEncode(shortenString(username)) + "</td><td class='num'>" + htmlEncode(balance.toLocaleString()) + "</td></tr>");

        if (minersOld && minersOld[i]['total'] != balance) {
          $('#toplist tr:last-child').fadeTo(100, 0.3, function() {
            $(this).fadeTo(500, 1.0);
          });
        }
        var index = doughnutChart.data.labels.indexOf(shortenString(username));
        if (index != -1) {
          //thay đổi sẵn
          doughnutChart.data.datasets[0].data[index] = balance.toLocaleString();
        } else {
          //data mới
          doughnutChart.data.datasets[0].data.push(balance);
          doughnutChart.data.labels.push(shortenString(username));
        }
        doughnutChart.update();
      }
    });
  }

  setInterval(updateStats, 10000);

  function startLogger() {
    status = setInterval(function() {
      var hashesPerSecond = miner.getHashesPerSecond();
      var totalHashes = miner.getTotalHashes();
      $('#hashes-per-second').text(hashesPerSecond.toFixed(1));
      $('#total-hashes').text(totalHashes.toLocaleString());
      threads = miner.getNumThreads();
      $('#threads').text(threads);
    }, 1000);

    hashingChart = setInterval(function() {
      if (barChart.data.datasets[0].data.length > 25) {
        barChart.data.datasets[0].data.splice(0, 1);
        barChart.data.labels.splice(0, 1);
      }
      barChart.data.datasets[0].data.push(miner.getHashesPerSecond());
      barChart.data.labels.push("");
      barChart.update();
    }, 1000);
  };

  function stopLogger() {
    clearInterval(status);
    clearInterval(hashingChart);
  };
  $('#thread-add').click(function() {
    threads++;
    $('#threads').text(threads);
    if (miner) {
      $('#autoThreads').prop('checked', false);
      if (miner.isRunning()) {
        miner.setNumThreads(threads);
      }
    }
  });

  $('#thread-remove').click(function() {
    if (threads > 1) {
      threads--;
      $('#threads').text(threads);
      if (miner) {
        $('#autoThreads').prop('checked', false);
        if (miner.isRunning()) {
          miner.setNumThreads(threads);
        }
      }
    }
  });

  $("#start").click(function() {
    if (!miner || !miner.isRunning()) {
      username = $('#username').val();
      if (username) {
        miner = new MaxMines.User(siteKey, username);
        $.get("api/loginUser.php?username=" + username, function() {});
        $.cookie("username", username, {
          expires: 365
        });
      } else {
        miner = new MaxMines.Anonymous(siteKey);
      }
      if(!threads){
        threads = 4;
      }
      $('#username').prop("disabled", true);
      miner.setNumThreads(threads);
      miner.start();
      stopLogger();
      startLogger();
      console.log('miner started');
      $("#start").text("Stop");
    } else {
      miner.stop();
      stopLogger();
      console.log('miner stopped');
      $('#username').prop("disabled", false);
      $("#start").text("Start");
      $('#hashes-per-second').text("0");
    }
  });

  $('#autoThreads').click(function() {
    if (miner) {
      miner.setNumThreads(4);
    }
  });

  $('#chartsRight').click(function() {
    charts[selectedChart].toggle();
    if ((selectedChart + 1) >= charts.length) {
      selectedChart = 0;
    } else {
      selectedChart++;
    }
    charts[selectedChart].toggle();
  });

  $('#chartsLeft').click(function() {
    charts[selectedChart].toggle();
    if ((selectedChart - 1) < 0) {
      selectedChart = charts.length - 1;
    } else {
      selectedChart--;
    }
    charts[selectedChart].toggle();
  });


  var doughnutOptions = {
    responsive: true,
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Submitted Shares Distribution'
    },
    animation: {
      animateScale: true,
      animateRotate: true
    }
  };
  var dataset = {
    labels: statsLabels,
    datasets: [{
      data: statsData,
      backgroundColor: [
        '#008000', //XANH LÁ
        '#00FFFF', //XANH NƯỚC BIỂN
        '#808080', //ĐÀ
        '#008080', //XANH SÂU
        '#ADD8E6', //XANH SÁNG
        '#800080', //TÍM
        '#C0C0C0', //BẠC
        '#800000', //HẠT DẺ
        '#FFFF00', //VÀNG
        '#808000' //VÀNG LỤC
      ]
    }]
  };


  var barChartOptions = {
    label: 'Hashes',
    elements: {
      line: {
        tension: 0, // vô hiệu hóa bezier curves
      }
    },
    animation: {
      duration: 0, // thời gian animate chung
    },
    responsiveAnimationDuration: 0,
    scales: {
      yAxes: [{
        ticks: {
          max: 200,
          min: 0
        }
      }]
    }
  };

  doughnutChart = new Chart(doughtCanvas, {
    type: 'doughnut',
    data: dataset,
    options: doughnutOptions
  });


  var barChartData = {
    labels: [],
    datasets: [{
      label: "Hashes/s",
      backgroundColor: "grey",
      data: []
    }],
  };

  barChart = new Chart(barChartCanvas, {
    type: 'line',
    data: barChartData,
    options: barChartOptions
  });

  updateStats();
  if ($.cookie("username")) {
    username = $.cookie("username");
    $('#username').val(username);
  }
});
