package server

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	fs "github.com/JigokuKozou/fs/internal/filesystem"
)

type Statistic struct {
	DirPath         string  `json:"dirPath"`
	TotalSize       int64   `json:"totalSize"`
	LoadTimeSeconds float64 `json:"loadTimeSeconds"`
}

func sendStatistics(response Response) {
	urlStatisticServer := fmt.Sprintf("http://%s:%s/%s",
		configServer.ApacheHost, configServer.ApachePort, configServer.ApachePathPostStat)

	statistic := Statistic{
		DirPath:         response.RootDir,
		TotalSize:       fs.DefaultDirSize,
		LoadTimeSeconds: response.LoadTimeSeconds,
	}

	for _, entity := range response.Entities {
		statistic.TotalSize += entity.Size
	}

	jsonStatistic, err := json.Marshal(statistic)
	if err != nil {
		log.Println(err)
		return
	}

	resp, err := http.Post(urlStatisticServer, "application/json", bytes.NewBuffer(jsonStatistic))
	if err != nil {
		log.Println(err)
		return
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusNoContent {
		log.Printf("Ошибка отправки статистики: %s %s\n", resp.Status, jsonStatistic)
	}
}
