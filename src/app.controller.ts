import { Body, Controller, Get, Post, Render, Res } from '@nestjs/common';
import type { Response } from 'express';
import fs from 'fs';
import path from 'path';
import { AppService } from './app.service';

class ReservationDto {
  name: string;
  email: string;
  date: string;
  customers: string;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  getHello() {
    const error: string = '';
    return {
      error,
      values: {},
    };
  }

  @Post('/reserv')
  postData(@Body() dto: ReservationDto, @Res() res: Response) {
    let error: string = '';

    //html-ben figyeli ezeket de azért mégegyszer leellenőrzi
    if (
      dto.name.trim() == '' ||
      dto.email.trim() == '' ||
      dto.date.trim() == '' ||
      dto.customers.trim() == ''
    ) {
      error = 'Minden mezőt kötelező kitölteni';
     return res.render('index', {
        error,
        values: dto,
      })
    }

    if (!dto.name.trim().includes(' ')) {
      error = 'Teljes nevet adjon meg';
      return res.render('index', {
        error,
        values: dto,
      })
    }

    const regexEmail = /^\S+@+\S+$/;

    if (!regexEmail.test(dto.email)) {
      error = 'Érvényes email címet adjon meg';
      return res.render('index', {
        error,
        values: dto,
      })
    }

    const now = new Date();
    const i = new Date(dto.date);

    if(now >= i){
      error = "Érvényes dátumot adjon meg!";
      return res.render('index', {
        error,
        values: dto,
      })
    }

    const customersNum: number = parseInt(dto.customers);

    if (customersNum < 0) {
      error = 'Érvényes néző számot adjon meg';
      return res.render('index', {
        error,
        values: dto,
      })
    }



    //if (error == '') {
      const filePath = path.join(__dirname, '..', 'reservation.csv');

      const header = 'név;email;időpont;nézők\n';
      const line = `${dto.name};${dto.email};${dto.date};${dto.customers}\n`;

      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, header + line, 'utf-8');
      } else {
        fs.appendFileSync(filePath, line, 'utf-8');
      }

      res.redirect("/success")
    /*} else {
      return res.render('index', {
        error,
        values: dto,
      });
    }*/
  }

  @Get("/success")
  @Render("success")
  success(){
    return;
  }
}
