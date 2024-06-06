<?php

function debug($data)
{
    echo '<pre>';
    echo print_r($data,true);
    echo '</pre>';
}

class Handler
{

    private function renderLabelA4($title, $quantity) {
        if(strlen($title) > 300) {
            $titleSize = '5';
        } elseif (strlen($title) > 100) {
            $titleSize = '4';
        } else {
            $titleSize = '3';
        }
        $view = "
        <table class='table table-A4 is-bordered has-text-centered'>
        <tr>
            <td rowspan='6' class='py-6 is-vcentered'><img class='img-A4' src='/img/pic.png'></td>
            <td class='has-text-weight-bold is-size-3'>Не бросать!</td>
            <td rowspan='6' class='is-vcentered p-0'><div class='has-text-weight-bold is-size-2 zakaz-A4'>Заказ {$this->orderNum}</div></td>
        </tr>
        <tr><td class='np-title is-size-3'>{$this->labelName}</td></tr>
        <tr><td class='has-text-weight-bold is-size-1 p-0 np-title'><span>{$this->title}</span><br><span class='has-text-weight-normal'>№ {$this->num} от {$this->date}</span><br><p class=\"is-size-{$titleSize}\">{$title}</p></td></tr>
        <tr><td class='has-text-right np-title is-size-3'>В пачке <span class='is-size-2 has-text-weight-bold'>{$quantity}</span> экз.</td></tr>
        <tr><td class='is-size-4'>ООО 'Элефант'<br>
        Россия, 610004, г. Киров, ул. Ленина, 2Б</td></tr>
        <tr><td class='has-text-weight-bold is-size-4'>{$this->year}</td></tr>        
        </table>
      ";
      return $view;
    }

    private function renderLabelA6($title, $quantity) {
        if(strlen($title) > 300) {
            $titleSize = '7';
        } elseif (strlen($title) > 100) {
            $titleSize = '6';
        } else {
            $titleSize = '5';
        }
        $view = "
        <table class='table table-A6 is-bordered has-text-centered mb-6'>
        <tr>
            <td rowspan='6' class='py-2 is-vcentered'><img class='img-A6' src='/img/pic.png'></td>
            <td class='has-text-weight-bold is-size-5 p-0'>Не бросать!</td>
            <td rowspan='6' class='is-vcentered p-0'><div class='has-text-weight-bold is-size-4 has-text-centered zakaz-A6'>Заказ {$this->orderNum}</div></td>
        </tr>
        <tr><td class='np-title is-size-6'>{$this->labelName}</td></tr>
        <tr><td class='has-text-weight-bold is-size-4 p-0 np-title'><span>{$this->title}</span><br><span class='has-text-weight-normal'>№ {$this->num} от {$this->date}</span><br><p class=\"is-size-{$titleSize}\">{$title}</p></td></tr>
        <tr><td class='has-text-right np-title is-size-5'>В пачке <span class='is-size-4 has-text-weight-bold'>{$quantity}</span> экз.</td></tr>
        <tr><td class='is-size-7'>ООО 'Элефант'<br>
        Россия, 610004, г. Киров, ул. Ленина, 2Б</td></tr>
        <tr><td class='has-text-weight-bold is-size-6 p-0'>{$this->year}</td></tr>        
        </table>
      ";
      return $view;
    }

    private function renderPageA4() 
    {
        $view = "<link rel='stylesheet' href='../css/bulma.min.css'>
        <link rel='stylesheet' href='../css/printstyle.css?2'>";
        foreach($this->data as $item) {
            $i = 0;
            while($i < $item['labelsFullPackCount']) {
                $view = $view . $this->renderLabelA4($item['title'], $this->maxItemsInPack);
                $i++;
            }
            if(isset($item['labelTail'])) {
                $view = $view . $this->renderLabelA4($item['title'], $item['labelTail']);
            }            
        };
        return $view;
    }

    private function renderPageA6() 
    {
        $view = "<link rel='stylesheet' href='../css/bulma.min.css'>
        <link rel='stylesheet' href='../css/printstyle.css?2'>
        <div class='columns'><div class='column is-half'>{{column-left}}</div><div class='column is-half'>{{column-right}}</div></div>";
        $viewLeft = "";
        $viewRight = "";
        $leftColumn = true;
        foreach($this->data as $item) {
            $i = 0;
            while($i < $item['labelsFullPackCount']) {
                if ($leftColumn) {
                    $viewLeft = $viewLeft . $this->renderLabelA6($item['title'], $this->maxItemsInPack);
                } else {
                    $viewRight = $viewRight . $this->renderLabelA6($item['title'], $this->maxItemsInPack);
                };
                $leftColumn = !$leftColumn;
                $i++;
            }
            if(isset($item['labelTail'])) {
                if ($leftColumn) {
                    $viewLeft = $viewLeft . $this->renderLabelA6($item['title'], $item['labelTail']);
                } else {
                    $viewRight = $viewRight . $this->renderLabelA6($item['title'], $item['labelTail']);
                }
                $leftColumn = !$leftColumn;
            }            
        };
        $view = str_replace('{{column-left}}', $viewLeft, $view);
        $view = str_replace('{{column-right}}', $viewRight, $view);
        return $view;
    }

    private function calculateEditorialPart() 
    {
        $sum = 0;
        foreach($this->data as $item) {
          $sum += $item['value'];
        };
        return $this->totalCount - $sum;
    }

    public function generateLabels()
    {
        $this->editorialPart = $this->calculateEditorialPart();
        if ($this->editorialPart > 0) {
            $this->data[] = [
                'title' => 'Редакция', 
                'value' => $this->editorialPart
            ];
        }
        foreach($this->data as &$item) {
            $item['labelsFullPackCount'] = floor($item['value']/$this->maxItemsInPack);
            if ($item['value'] % $this->maxItemsInPack) {
                $item['labelTail'] = $item['value'] % $this->maxItemsInPack;
            };
        }
        switch ($this->size) {
            case 'A4': 
                return $this->renderPageA4();                
                break;
            case 'A6': 
                return $this->renderPageA6();
                break;
        }
    }

    public function __construct($data)
    {
        $this->data = $data['data'];
        $this->date = $data['date'];
        $this->labelName = $data['labelName'];
        $this->maxItemsInPack = $data['maxItemsInPack'];
        $this->num = $data['num'];
        $this->orderNum = $data['orderNum'];
        $this->size = $data['size'];
        $this->title = $data['title'];
        $this->totalCount = $data['totalCount'];
        $this->year = date('Y');
    }
}



$request=json_decode(file_get_contents('php://input'),true);

$result = new Handler($request['data']);
echo json_encode($result->generateLabels());
// debug($result);





