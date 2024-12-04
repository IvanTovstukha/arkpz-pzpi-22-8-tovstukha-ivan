package main

import (
	"errors"
	"fmt"
	"io/ioutil"
	"os"
	"sync"
)

type Person struct {
	Name string
	Age  int
}

func (p *Person) Name() string {
	return p.Name
}

func (p *Person) Age() int {
	return p.Age
}

type MyStruct struct {
	mu sync.Mutex
	logs []string
}

func (m *MyStruct) AddLog(message string) {
	m.mu.Lock()
	defer m.mu.Unlock()
	m.logs = append(m.logs, message)
}

type CreditCardPayment struct{}

func (c *CreditCardPayment) ProcessPayment(amount float64) {
	fmt.Println("Payment processed:", amount)
}

type MyServer struct {
	paymentProcessor *CreditCardPayment
	users            []*Person
	logger           *MyStruct
}

func (s *MyServer) StartServer() {
	fmt.Println("Server started")
	for _, user := range s.users {
		message := fmt.Sprintf("User %s (age %d) connected", user.GetName(), user.GetAge())
		fmt.Println(message)
		s.logger.AddLog(message)
	}

	s.paymentProcessor.ProcessPayment(100.0)
}

func divide(a, b int) (int, error) {
	if b == 0 {
		return 0, errors.New("division by zero")
	}
	return a / b, nil
}

func mustReadConfigFile() string {
	file, err := os.Open("config.yaml")
	if err != nil {
		panic(fmt.Sprintf("Failed to open config file: %v", err))
	}
	defer file.Close()

	var config string
	_, err = fmt.Fscanf(file, "%s", &config)
	if err != nil {
		panic(fmt.Sprintf("Failed to read config file: %v", err))
	}

	return config
}

func readFile(filePath string) (string, error) {
	file, err := os.Open(filePath)
	if err != nil {
		return "", err
	}
	defer file.Close()

	contents, err := ioutil.ReadAll(file)
	if err != nil {
		return "", err
	}

	return string(contents), nil
}

func main() {
	config := mustReadConfigFile()
	fmt.Println("Config loaded:", config)

	logger := &MyStruct{}
	server := &MyServer{
		paymentProcessor: &CreditCardPayment{},
		users: []*Person{
			{Name: "Alice", Age: 25},
			{Name: "Bob", Age: 30},
		},
		logger: logger,
	}

	server.StartServer()

	fileContent, err := readFile("example.txt")
	if err != nil {
		fmt.Println("Error reading file:", err)
	} else {
		fmt.Println("File content:", fileContent)
	}

	result, err := divide(10, 2)
	if err != nil {
		fmt.Println("Error during division:", err)
	} else {
		fmt.Println("Division result:", result)
	}

	logger.mu.Lock()
	fmt.Println("Logs:", logger.logs)
	logger.mu.Unlock()
}
